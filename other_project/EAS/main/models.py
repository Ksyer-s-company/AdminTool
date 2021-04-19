from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, AbstractBaseUser
from shortuuidfield import ShortUUIDField


class Sche(models.Model):
    s_id = models.AutoField(primary_key=True)
    kind = models.CharField(max_length=10)  # 排班的类别，如朝九晚五等
    work_begin = models.TimeField(blank=True, null=True)
    work_end = models.TimeField(blank=True, null=True)

    def __str__(self):
        return self.kind

    class Meta:
        db_table = 'Sche'

class UserManager(BaseUserManager): #自定义Manager管理器
    def _create_user(self,username,password,**kwargs):
        if not username:
            raise ValueError("请传入用户名！")
        if not password:
            raise ValueError("请传入密码！")
        user = self.model(username=username,**kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_user(self,username,password,**kwargs): # 创建普通用户
        kwargs['depart'] = 0
        return self._create_user(username,password,**kwargs)

    def create_superuser(self,username,password,email,**kwargs): # 创建超级用户
        kwargs['depart'] = 0
        kwargs['position'] = 0
        return self._create_user(username,password,**kwargs)

class User(AbstractBaseUser):
    GENDER_TYPE = (
        ("1","男"),
        ("2","女")
    )
    e_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=15, verbose_name="用户名", unique=True)
    gender = models.CharField(max_length=2, choices=GENDER_TYPE, verbose_name="性别", null=True, blank=True, default="")
    phone = models.CharField(max_length=11, null=True, blank=True, verbose_name="手机号码", default="")
    email = models.EmailField(verbose_name="邮箱", default="", null=True, blank=True)
    birth = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    e_sche = models.ForeignKey(Sche, on_delete=models.SET_NULL, db_column='e_sche', null=True, default="", blank=True)
    position = models.IntegerField(verbose_name="职位", null=True, default=2, blank=True)
    depart = models.CharField(max_length=20, verbose_name="部门", null=True, default='', blank=True)
    theory_lat = models.FloatField(verbose_name="理论纬度", null=True, blank=True)
    theory_lag = models.FloatField(verbose_name="理论经度", null=True, blank=True)
    is_notify = models.IntegerField(verbose_name="是否提醒", default=True, null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    def info(self):
        if self.position == 0:
            pos_name = "经理"
        elif self.position == 1:
            pos_name = "部门主管"
        else:
            pos_name = "员工"
        return [self.e_id, self.username, self.depart, pos_name]

    def myaccount(self):
        if self.position == 0:
            pos_name = "经理"
        elif self.position == 1:
            pos_name = "部门主管"
        else:
            pos_name = "员工"
        return [self.username, self.email, self.e_id, self.depart, self.password, self.phone]

    def sche_info(self):
        if self.e_sche == None:
            sche_name = '未安排排班'
            sche_time = '--------'
        else:
            sche_name = self.e_sche.kind
            if sche_name == '未命名':
                sche_name = '其他'
            sche_time = str(self.e_sche.work_begin)[
                :5] + '-' + str(self.e_sche.work_end)[:5]
        return [self.e_id, self.username, self.depart, sche_name, sche_time, self.e_sche_id]

    class Meta:
        verbose_name = "用户"
        verbose_name_plural = verbose_name


class Attendance(models.Model):
    a_id = models.AutoField(primary_key=True)
    emp = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column='emp', null=True)  # 考勤的员工
    clock_in = models.DateTimeField(null=True, blank=True)
    ring_out = models.DateTimeField(null=True, blank=True)
    theory_work_begin = models.TimeField(null=True, blank=True)
    theory_work_end = models.TimeField(null=True, blank=True)

    class Meta:
        db_table = 'Attendance'


class Leavee(models.Model):
    l_id = models.AutoField(primary_key=True)
    l_begin = models.DateTimeField(blank=True, null=True)
    l_end = models.DateTimeField(blank=True, null=True)
    l_reason = models.TextField(blank=True, null=True)
    kind = models.IntegerField(blank=True, null=True)  # 0表示事假， 1表示病假
    apply_time = models.DateTimeField(blank=True, null=True) # 申请时间
    l_emp = models.ForeignKey(User, on_delete=models.CASCADE, db_column='l_emp', null=True)
    approved = models.BooleanField(blank=False, null=False, default=False)  # 申请是否通过
    cancel = models.BooleanField(blank=False, null=False, default=False)  # 是否销假
    handle = models.BooleanField(blank=False, null=False, default=False) # 主管是否已经处理过

    def __str__(self):
        return self.l_reason

    class Meta:
        db_table = 'Leavee'


class Overtime(models.Model):
    o_id = models.AutoField(primary_key=True)
    ot_date = models.DateField(blank=True, null=True)
    time_length = models.FloatField(blank=True, null=True)
    o_reason = models.TextField(blank=True, null=True)
    o_emp = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column='o_emp', null=True)
    is_holiday = models.BooleanField(default=False)
    approved = models.BooleanField(blank=False, null=False, default=False)  # 申请是否通过
    handle = models.BooleanField(blank=False, null=False, default=False) # 主管是否已经处理过

    def __str__(self):
        return self.o_reason

    class Meta:
        db_table = 'Overtime'


class ScheHistory(models.Model):
    sh_id = models.AutoField(primary_key=True)  # 主键
    change_time = models.DateField(blank=True, null=True)  # 更改的时间
    change_sche = models.ForeignKey(
        Sche, on_delete=models.SET_NULL, db_column='change_sche', null=True)  # 更改的班次类型
    emp = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column='emp', null=True)  # 变更班次的员工

    class Meta:
        db_table = 'ScheHistory'


class Casual(models.Model):     # 临时加班活动
    c_id = models.AutoField(primary_key=True)
    c_reason = models.TextField(blank=True, null=True)
    c_begin = models.DateTimeField(blank=True, null=True)
    c_end = models.DateTimeField(blank=True, null=True)
    is_holiday = models.BooleanField(default=False)

    class Meta:
        db_table = 'Casual'


class Emp_Casual(models.Model):
    ec_id = models.AutoField(primary_key=True)
    casual = models.ForeignKey(
        Casual, on_delete=models.SET_NULL, db_column='casual', null=True)
    emp = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column='emp', null=True)

    class Meta:
        db_table = 'Emp_Casual'

