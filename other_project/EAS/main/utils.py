from .models import *
from django.db.models import Q
from datetime import date
import os
import datetime
import time
from chinese_calendar import is_holiday
from datetime import timedelta
import calendar
import hashlib

m = hashlib.md5()


def query_emp_all():
    '''
    查询所有员工的基本信息  
    Args:
        void
    Returns:
        list对象，工号，姓名，所属部门，职务
    '''
    cont = []
    emps = User.objects.all()
    for e in emps:
        if e.position == 0:
            continue
        cont.append(e.info())
    return cont


def query_oneemp_by_id(id):
    '''
    查询某一个员工信息  
    Args:
        id: 编号
    Returns:
        list对象:e.info
    '''
    try:
        e = User.objects.get(e_id=id)
    except:
        raise Exception("未找到指定的员工工号")
    else:
        return e.info()


def query_empmsg_id(id):
    '''
    查询某一个员工信息  
    Args:
        id: 编号
    Returns:
        list对象:e.myaccount
    '''
    try:
        e = User.objects.get(e_id=id)
    except:
        raise Exception("未找到指定的员工工号")
    else:
        return e.myaccount()


def delete_oneemp_by_id(id):
    '''
    删除某一个员工信息  
    Args:
        id: 编号
    Returns:
        list对象
    '''
    try:
        e = User.objects.get(e_id=id)
    except:
        raise Exception("未找到指定的员工工号")
    else:
        e.delete()


def query_ws_all():
    '''
    查询所有员工的基本信息  
    Args:
        void
    Returns:
        list对象，姓名，所属部门，职务
    '''
    pass


def query_ws(init_wm, year, month, id):
    first_day = datetime.date(year, month, 1)
    tmp = first_day.replace(day=28) + datetime.timedelta(days=4)
    last_day = tmp - datetime.timedelta(days=tmp.day)
    sche_historys = ScheHistory.objects.filter(emp=id)
    his = []
    work_mode = [init_wm]
    for sche_history in sche_historys:
        s = sche_history.change_time
        id = sche_history.change_sche.s_id
        obj = Sche.objects.filter(s_id=id)[0]
        work_begin = obj.work_begin
        work_end = obj.work_end
        his.append(s)
        dict = {
            'wm_kind': sche_history.change_sche.__str__(),
            'wm_begin': work_begin,
            'wm_end': work_end,
        }
        work_mode.append(dict)

    change_day = []
    now_day = first_day
    while now_day < last_day:
        now_day = now_day + timedelta(days=1)
        if now_day in his:
            change_day.append(now_day)

    if change_day != []:
        change_day.append(change_day[-1])

    now_day = datetime.date(year, month, 1)
    idx = 0
    ret = {}

    while now_day <= last_day:
        ret[str(now_day)] = work_mode[idx]
        now_day = now_day + timedelta(days=1)
        if change_day != [] and now_day == change_day[idx]:
            idx += 1
    return ret


def query_emp_by_id(start_id, end_id):
    '''
    查询员工信息
    Args:
        start_id: 开始的编号
        end_id: 结束的编号
    Returns:
        list对象
    '''
    cont = []
    emps = User.objects.filter(e_id__gte=start_id, e_id__lte=end_id)
    for e in emps:
        if e.position != -1:
            cont.append(e.info())
    return cont


def query_sche_name():
    '''
    查询当前所有工作模式名称
    Args:        
    Returns:
        list对象
    '''
    schename = []
    sches = Sche.objects.all()
    for s in sches:
        if s.kind not in schename and s.kind != '未命名':
            schename.append(s.kind)
    schename.append('其他')
    return schename


def query_depart_name():
    '''
    查询当前所有部门名称
    Args:        
    Returns:
        list对象
    '''
    departname = []
    emps = User.objects.all()
    for e in emps:
        if e.depart not in departname and e.depart != 'None' and e.depart != None:
            departname.append(e.depart)
    return departname


def edit_emp_infor(e_id, name, depart, pos):
    '''
    经理编辑更新员工信息
    Args:
        e_id: 员工的id号
        name：员工姓名
        depart：员工部门
        pos:员工职位
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    emp.username = name
    emp.depart = depart
    emp.position = pos
    emp.save()


def update_personal_msg(e_id, email, phone):
    '''
    员工编辑更新员工信息
    Args:
        e_id: 员工的id号
        email：员工email        
        phone:员工电话
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    emp.email = email
    emp.phone = phone
    emp.save()


def update_personal_pwd(e_id, pwd):
    '''
    员工编辑更新员工密码
    Args:
        e_id: 员工的id号    
        pwd：员工密码        
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    emp.set_password(pwd)
    emp.save()


def get_pwd(e_id):
    emp = User.objects.get(e_id=e_id)
    return emp.password


def update_emp_sche_forever(e_id, s_id, begintime, endtime):
    '''
    永久更新员工的班次
    Args:
        e_id: 员工的id号
        s_id: 班次的id
        如果s_id == -1,说明是一个新的sche
        begintime: shce的开始时间
        endtime: sche的结束时间
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    if s_id != -1:
        sche = Sche.objects.get(s_id=s_id)
    else:
        sche = Sche(kind='未命名', work_begin=begintime, work_end=endtime)
        sche.save()
    emp.e_sche = sche
    emp.save()

    sh = ScheHistory(change_time=date.today(), change_sche=sche, emp=emp)
    sh.save()


def update_cancel_date(l_id, l_end):
    '''
    销假时更新请假结束时间
    Args:
        l_id: 销假表的id号
        l_end: 新的销假结束时间
    Returns:
        void
    '''
    lea = Leavee.objects.get(l_id=l_id)
    lea.l_begin = lea.l_begin.replace(tzinfo=None)
    print(lea.l_begin.tzinfo)
    if lea.l_begin < l_end:
        lea.l_end = l_end
        lea.cancel = True
        lea.save()
        return True
    else:
        return False


def update_emp_sche_temp(e_id, s_id, begintime, endtime, duration_begin, duration_end):
    '''
    临时更新员工的班次
    Args:
        e_id: 员工的id号
        s_id: 班次的id
        如果s_id == -1,说明是一个新的sche
        begintime: shce的开始时间
        endtime: sche的结束时间
        duration_end: 此次临时调整的结束时间
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    last_sche = emp.e_sche
    if s_id != -1:
        sche = Sche.objects.get(s_id=s_id)
    else:
        sche = Sche(kind='未命名', work_begin=begintime, work_end=endtime)
        sche.save()
    today = datetime.date.today()
    [db_year, db_month, db_day] = duration_begin.split('-')
    db_year, db_month, db_day = int(db_year), int(db_month), int(db_day)
    if today.year == db_year and today.month == db_month and today.day == db_day:
        emp.e_sche = sche
        emp.save()
    sh = ScheHistory(change_time=duration_begin, change_sche=sche, emp=emp)
    sh.save()
    sh = ScheHistory(change_time=duration_end, change_sche=last_sche, emp=emp)
    sh.save()


def update_emp_information(e_id, **info):
    '''
    更新员工的基本信息
    Args:
        e_id: 员工的id号
        s_id: 班次的id
    Returns:
        void
    '''
    emp = User.objects.get(e_id=e_id)
    if 'password' in info:
        emp.password = info['password']
    if 'name' in info:
        emp.username = info['name']
    if 'birth' in info:
        emp.birth = info['birth']
    if 'email' in info:
        emp.email = info['email']
    if 'gender' in info:
        emp.gender = info['gender']
    if 'phone' in info:
        emp.phone = info['phone']
    emp.save()


def new_emp(name, depart, pos):
    '''
    新增一个员工  
    Args:
        id：工号
        name：员工姓名
        depart：部门名称
        pos: 职位        
    Returns:
        void

    all_eid = User.objects.values_list('e_id', flat=True)
    for a in all_eid:
        if id == a:
            return False
    '''
    e = User.objects.create_user(username=name, password='111111')
    e.depart = depart
    e.position = pos
    e.save()
    # return True


def add_emp(name, dept, position, sche_id):
    '''
    添加一个员工  
    Args:
        name：员工姓名
        dept：部门名称
        position: 职位
        sche_id：班次的编号
    Returns:
        void
    '''
    sche = Sche.objects.get(s_id=sche_id)
    manager = User.objects.get(depart=dept, position=1)
    if position == 1 and manager:
        raise Exception('该部门已经存在主管')
    e = User(username=name, position=position, depart=dept, e_sche=sche)
    e.save()
    sh = ScheHistory(change_time=date.today(), change_sche=sche, emp=e)
    sh.save()


def add_Leave(eid, l_begin, l_end, l_reason, kind):
    '''
    添加一个请假信息
    '''
    e = User.objects.get(e_id=eid)
    leave = Leavee(l_begin=l_begin, l_end=l_end,
                   l_reason=l_reason, kind=kind,
                   apply_time=datetime.datetime.now(), l_emp=e)
    leave.save()


def query_last_five_leave(e_id):
    '''
    查询某人最近5次的请假记录  
    Args:
        e_id: 员工编号
    Returns:
        嵌套list对象，外层一共最多5个list，内层为[原因、申请时间、类型、结果]
    '''
    e = User.objects.get(e_id=e_id)
    leaves = Leavee.objects.filter(l_emp=e).order_by('-apply_time')
    res = []
    for index, leave in enumerate(leaves):
        if index >= 5:
            break
        tmp = []
        apply_time = leave.apply_time.strftime('%Y:%m:%d %H:%M')
        if leave.kind == 0:
            kind = '事假'
        elif leave.kind == 1:
            kind = '病假'
        else:
            kind = '其他'
        if leave.handle == False:
            ans = '主管未处理'
        else:
            if leave.approved == True:
                ans = '已通过'
            else:
                ans = '未通过'
        tmp.append(leave.l_reason)
        tmp.append(apply_time)
        tmp.append(kind)
        tmp.append(ans)
        res.append(tmp)
    return res


def query_notcancel_leave(eid):
    '''
    查询某人所有未销假的记录   
    Args:
        e_id: 员工编号
    Returns:
        嵌套list对象，内层为[开始时间，结束时间，类型]
    '''
    e = User.objects.get(e_id=eid)
    leaves = Leavee.objects.filter(l_emp=e, cancel=False, handle=True)
    res = []
    for leave in leaves:
        tmp = []
        l_begin = leave.l_begin.strftime('%Y:%m:%d %H:%M')
        l_end = leave.l_end.strftime('%Y:%m:%d %H:%M')
        kind = leave.kind
        if kind == 0:
            kind = '事假'
        elif kind == 1:
            kind = '病假'
        else:
            kind = '其他'
        tmp.append(leave.l_id)
        tmp.append(l_begin)
        tmp.append(l_end)
        tmp.append(kind)
        res.append(tmp)
    return res


def query_attendance_by_emp(e, year, month):
    '''
    查询某员工所有考勤记录  
    Args: 
        e : 员工对象
        year: 某年
        month: 月份
    Returns: 
        List对象，在指定月份中的id, name, depart, 正常工作时间、
        平时加班时间、节假日加班时间、请假时长、总工作时长
    '''
    attes = Attendance.objects.filter(emp=e)
    over_times = Overtime.objects.filter(o_emp=e, approved=True, handle=True)
    leaves = Leavee.objects.filter(l_emp=e, approved=True, handle=True)
    casus = Emp_Casual.objects.filter(emp=e)
    ans = []
    ans.append(e.e_id)
    ans.append(e.username)
    ans.append(e.depart)
    normal_working_hours = 0.0
    for atte in attes:
        if atte.clock_in.year == year and atte.clock_in.month == month:
            if atte.ring_out:
                work_hours = atte.ring_out - atte.clock_in
            else:
                work_end = datetime.datetime(atte.clock_in.year,
                                             atte.clock_in.month,
                                             atte.clock_in.day,
                                             atte.theory_work_end.hour,
                                             atte.theory_work_end.minute,
                                             atte.theory_work_end.second)
                clock_in = atte.clock_in.replace(tzinfo=None)
                work_hours = work_end - clock_in
            normal_working_hours += (work_hours.seconds / 3600)
    ans.append(round(normal_working_hours, 1))
    normal_overtime = 0.0
    holiday_overtime = 0.0
    for ot in over_times:
        if ot.ot_date.year == year and ot.ot_date.month == month:
            if ot.is_holiday:
                holiday_overtime += ot.time_length
            else:
                normal_overtime += ot.time_length
    for casu in casus:
        if casu.casual.c_begin.year == year and casu.casual.c_begin.month == month:
            ot_hours = casu.casual.c_end - casu.casual.c_begin
            ot_hours = ot_hours.seconds / 3600
            if casu.casual.is_holiday:
                holiday_overtime += ot_hours
            else:
                normal_overtime += ot_hours
    ans.append(round(normal_overtime, 1))
    ans.append(round(holiday_overtime, 1))

    leave_times = 0.0
    for lea in leaves:
        emp_sche = query_emp_sche_month(e.e_id, year, month)
        emp_sche = emp_sche['sche']
        if lea.l_begin.year == year and lea.l_begin.month < month and lea.l_end.month == month:
            begin = 1
            end = lea.l_end.day
        elif lea.l_begin.year == year and lea.l_begin.month == month and lea.l_end.month > month:
            begin = lea.l_begin.day
            end = len(emp_sche['sche'])
        elif lea.l_begin.year == year and lea.l_begin.month == month and lea.l_end.month == month:
            begin = lea.l_begin.day
            end = lea.l_end.day
        else:
            continue
        for i in range(begin, end + 1):
            this_day = datetime.date(year, month, i)
            if this_day.weekday() == 6 or this_day.weekday() == 5:
                continue
            if len(emp_sche) == 0:
                continue
            if len(emp_sche[i - 1]) == 2:
                continue
            sche_begin = emp_sche[i - 1][2]
            sche_end = emp_sche[i - 1][3]
            a = datetime.datetime.strptime(sche_begin, '%H:%M:%S')
            b = datetime.datetime.strptime(sche_end, '%H:%M:%S')
            c = b - a
            leave_times += c.seconds / 3600
    ans.append(round(leave_times, 1))

    wrongTimes = 0
    for atte in attes:
        if atte.clock_in.year == year and atte.clock_in.month == month:
            work_end = datetime.datetime(atte.clock_in.year,
                                         atte.clock_in.month,
                                         atte.clock_in.day,
                                         atte.theory_work_end.hour,
                                         atte.theory_work_end.minute,
                                         atte.theory_work_end.second)
            work_begin = datetime.datetime(atte.clock_in.year,
                                           atte.clock_in.month,
                                           atte.clock_in.day,
                                           atte.theory_work_begin.hour,
                                           atte.theory_work_begin.minute,
                                           atte.theory_work_begin.second)
            clock_in = atte.clock_in.replace(tzinfo=None)
            if clock_in > work_begin:
                wrongTimes += 1
            if not atte.ring_out:
                wrongTimes += 1
            else:
                ring_out = atte.ring_out.replace(tzinfo=None)
                if ring_out < work_end:
                    wrongTimes += 1
    ans.append(wrongTimes)

    return ans


def query_month_attendance_all(year, month):
    '''
    经理查询所有人某一月的考勤
    Returns:
        两层list对象，外层为不同的人，
        内层为[工号，姓名，部门，正常工作时间，平时加班时间，
        节假日加班时间，请假时长，总工作时长]
    '''
    res = []
    emps = User.objects.all()
    for e in emps:
        if e.position == 0:
            continue
        res.append(query_attendance_by_emp(e, year, month))
    return res


def query_month_attendance_condition(year, month, eid, pos, depart):
    '''
    经理按条件查询某些人某一月的考勤
    Returns:
        两层list对象，外层为不同的人，
        内层为[工号，姓名，部门，正常工作时间，平时加班时间，
        节假日加班时间，请假时长，总工作时长]
    '''
    res = []
    if eid == '':
        eid = 0
    if pos == '':
        pos = -1
    x1 = User.objects.filter(e_id=eid)
    x2 = User.objects.filter(position=pos)
    x3 = User.objects.filter(depart=depart)
    x1, x2, x3 = set(x1), set(x2), set(x3)
    S = x1 | x2 | x3
    for s in [x1, x2, x3]:
        if len(s) > 0:
            S = S & s
    x = list(S)
    for a in x:
        res.append(query_attendance_by_emp(a, year, month))
    return res


def query_month_attendance_by_dapart(depart, year, month):
    '''
    部门主管查询本部门所有人某一月的的考勤
    Returns:
        两层list对象，外层为不同的人，
        内层为[工号，姓名，部门，正常工作时间，平时加班时间，
        节假日加班时间，请假时长，总工作时长]
    '''
    res = []
    emps = User.objects.filter(depart=depart)
    for e in emps:
        res.append(query_attendance_by_emp(e, year, month))
    return res


def add_Attendance(e_id, clock_in):
    '''
    添加考勤记录 
    Args:
        e_id : 员工编号
        clock_in : 上班打卡时间
    Returns:
        void
    # TODO:
        异常处理
    '''
    e = User.objects.get(e_id=e_id)
    atte = Attendance(emp=e, clock_in=clock_in,
                      theory_work_begin=e.e_sche.work_begin,
                      theroy_work_end=e.e_sche.work_end)
    atte.save()


def add_overtime(e_id, time_len, ot_reason, ot_date):
    '''
    添加加班记录 
    Args:
        e_id : 员工编号
        time_len：加班时长
        ot_reason:加班理由
        ot_date:加班日期
    Returns:
        void
    '''
    sign = is_holiday(ot_date)
    e = User.objects.get(e_id=e_id)
    add_ot = Overtime(ot_date=ot_date, time_length=time_len,
                      o_reason=ot_reason, is_holiday=sign, o_emp=e)
    add_ot.save()


def get_time_length(hour1, hour2, minute1, minute2, second1, second2):
    '''
    获得时间差
    Args:
        int hours1,hours2:小时
        int minute1,minute2:分钟
        int second1,second2:秒    
    Returns:
        str 两时间的差值
    '''
    if (hour2 >= hour1):
        total1 = hour1 * 3600 + minute1 * 60 + second1
        total2 = hour2 * 3600 + minute2 * 60 + second2
        value = total2 - total1
    else:
        total2 = hour2 * 3600 + minute2 * 60 + second2
        total_temp = 24 * 3600
        total1 = hour1 * 3600 + minute1 * 60 + second1
        value = total_temp - total1 + total2
    hour = str(value // 3600)
    minute = str(value % 3600 // 60)
    second = str(value % 60)
    return (hour+"时"+minute+"分")


def query_depart_sche_month(depart, year, month):
    '''
    查询某部门全体员工某月的班次
    Args:
        int year:某年
        int month:某月
        str depart:查询部门名称
    Returns:
        list对象，其中元素为字典，包含员工姓名，工号和班次，班次的值为嵌套list，
        每个元素为某天的排班的list，list中包括当天日期，上、下班时间，工作时长（暂未添加）
    '''
    emps = User.objects.filter(depart=depart)
    res_all = []
    for e in emps:
        emp_sche = query_emp_sche_month(e.e_id, year, month)
        res_all.append(emp_sche)
    return res_all


def query_oneday_sche(year, month, day):
    '''
    查询某一天所有人当前的班次：  
    Returns:
        嵌套list对象，工号，姓名，所属部门，工作时间模式
    '''
    res = []
    emps = User.objects.all()
    for e in emps:
        if e.position == 0:
            continue
        temp = []
        temp.append(e.e_id)
        temp.append(e.username)
        temp.append(e.depart)
        if e.e_sche == None:
            temp.append('未排班')
        else:
            emp_sche = query_emp_sche_month(e.e_id, year, month)
            emp_sche = emp_sche['sche']
            sche_name = emp_sche[day - 1][1]
            if sche_name == '未命名':
                sche_name = '其他模式'
            temp.append(sche_name)
        res.append(temp)
    return res


def query_oneday_sche_condition(eid, depart, year, month, day):
    '''
    经理按条件查询某一天所有人当前的班次：  
    Returns:
        嵌套list对象，工号，姓名，所属部门，工作时间模式
    '''
    res = []
    if eid == '':
        eid = 0
    x1 = User.objects.filter(e_id=eid)
    x3 = User.objects.filter(depart=depart)
    x1, x3 = set(x1), set(x3)
    S = x1 | x3
    for s in [x1, x3]:
        if len(s) > 0:
            S = S & s
    x = list(S)
    for e in x:
        temp = []
        temp.append(e.e_id)
        temp.append(e.username)
        temp.append(e.depart)
        if e.e_sche == None:
            temp.append('未排班')
        else:
            emp_sche = query_emp_sche_month(e.e_id, year, month)
            emp_sche = emp_sche['sche']
            sche_name = emp_sche[day - 1][1]
            if sche_name == '未命名':
                sche_name = '其他模式'
            temp.append(sche_name)
        res.append(temp)
    return res


def query_all_sche_by_depart(depart):
    '''
    查询某部门所有人当前的班次：  
    Args:
        depart: 部门名称
    Returns:
        嵌套list对象，工号，姓名，所属部门，工作时间模式，工作时间
    '''
    ans = []
    emps = User.objects.filter(depart=depart)
    for e in emps:
        check_scheEmp_isRight(e.e_id)
        ans.append(e.sche_info())
    return ans


def query_all_sche_by_depart_condition(depart, eid, schename):
    '''
    按条件筛选某部门所有人当前的班次：  
    Args:
        depart: 部门名称
    Returns:
        嵌套list对象，工号，姓名，所属部门，工作时间模式，工作时间
    '''
    res = []
    if eid == '':
        eid = 0
    if schename == '未安排排班':
        x2 = User.objects.filter(e_sche=None)
    else:
        if schename == '其他':
            schename = '未命名'
        sches = Sche.objects.filter(kind=schename)
        x2 = User.objects.filter(e_sche_id=-10)
        for sche in sches:
            x2 = x2 | User.objects.filter(e_sche=sche)

    x1 = User.objects.filter(e_id=eid)
    x1, x2 = set(x1), set(x2)
    S = x1 | x2
    for s in [x1, x2]:
        if len(s) > 0:
            S = S & s
    x = list(S)

    for e in x:
        if e.depart == depart:
            check_scheEmp_isRight(e.e_id)
            res.append(e.sche_info())
    return res


def query_all_sche_kind():
    '''
    查询所有班次：  
    Args:
        void
    Returns:
        嵌套list对象, 班次的id， 班次名称，上下班时间
    '''
    sches = Sche.objects.all()
    ans = []
    for sche in sches:
        if sche.kind != '未命名':
            tmp = []
            tmp.append(sche.s_id)
            tmp.append(sche.kind)
            tmp.append(sche.work_begin)
            tmp.append(sche.work_end)
            ans.append(tmp)
    return ans


def query_emp_sche_month(e_id, year, month):
    '''
    查询某员工某月的班次
    Args:
        int year:某年
        int month:某月
        int e_id:员工工号
    Returns:
        字典对象，包含员工姓名，工号和班次，班次的值为嵌套list，
        每个元素为某天的排班的list，list中包括当天日期，上、下班时间，工作时长（暂未添加）
    '''
    emp = User.objects.get(e_id=e_id)
    res_emp = {}
    res_emp['id'] = emp.e_id
    res_emp['name'] = emp.username
    res_emp['sche'] = []
    sign = False
    date_today = date.today()
    date_start = datetime.date(
        month=month, year=year, day=1)  #
    date_end = datetime.date(
        month=month, year=year, day=calendar.monthrange(year, month)[1])  # 获得当月月末日期
    emps_history = ScheHistory.objects.filter(
        emp=emp.e_id).order_by('change_time')  # 筛选当前对象的全部修改历史
    length = len(emps_history)
    # emps_history=sorted(emps_history,key=lambda x: expression)
    if emps_history:
        for i, h in enumerate(emps_history):
            if h.change_time > date_start:
                if i > 0:
                    tempty = i - 1
                    break
                else:
                    date_temp = date_start
                    date_start = h.change_time
                    tempty = 0
                    sign = True
                    break
            elif i == length - 1:
                tempty = length-1

        if sign:
            while date_temp < date_start and date_temp <= date_end:
                info = []
                info.append(str(date_temp))
                info.append('暂无此员工')
                date_temp += datetime.timedelta(days=1)
                res_emp['sche'].append(info)

        while tempty < length-1:
            # 找到30天内的更改记录
            while emps_history[tempty+1].change_time > date_start and date_end >= date_start:
                info = []
                info.append(str(date_start))
                info.append(emps_history[tempty].change_sche.kind)
                info.append(str(emps_history[tempty].change_sche.work_begin))
                info.append(str(emps_history[tempty].change_sche.work_end))
                worktime_length = get_time_length(
                    emps_history[tempty].change_sche.work_begin.hour, emps_history[tempty].change_sche.work_end.hour,
                    emps_history[tempty].change_sche.work_begin.minute, emps_history[tempty].change_sche.work_end.minute,
                    emps_history[tempty].change_sche.work_begin.second, emps_history[tempty].change_sche.work_end.second)
                info.append(worktime_length)
                info.append(emps_history[tempty].change_sche.s_id)
                date_start += datetime.timedelta(days=1)
                res_emp['sche'].append(info)
            tempty = tempty+1

        while date_end >= date_start:  # 最新的班次
            info = []
            info.append(str(date_start))
            info.append(emps_history[tempty].change_sche.kind)
            info.append(str(emps_history[tempty].change_sche.work_begin))
            info.append(str(emps_history[tempty].change_sche.work_end))
            worktime_length = get_time_length(
                emps_history[tempty].change_sche.work_begin.hour, emps_history[tempty].change_sche.work_end.hour,
                emps_history[tempty].change_sche.work_begin.minute, emps_history[tempty].change_sche.work_end.minute,
                emps_history[tempty].change_sche.work_begin.second, emps_history[tempty].change_sche.work_end.second)
            info.append(worktime_length)
            info.append(emps_history[tempty].change_sche.s_id)
            date_start += datetime.timedelta(days=1)
            res_emp['sche'].append(info)
    return res_emp


def read_csv(file_name):
    path = os.getcwd()
    f = open(path+'\\test_file\\'+file_name, 'r')
    content = f.read()
    content = str(content)
    final_list = list()
    rows = content.split('\n')
    for row in rows:
        final_list.append(row.split(','))
    f.close()
    return final_list


def readcsv(f):
    content = f.read()
    final_list = list()
    rows = content.split(b'\n')
    for row in rows:
        final_list.append(row.split(b','))
    return final_list


def update_emp_info(message):
    emps = User.objects.all()
    id = [s[0] for s in message]
    for emp, idx in enumerate(emps):
        if emp.e_id in id:
            User.objects.filter(eid=emp.e_id).update(username=message[idx][1])
        else:
            User.objects.create(
                e_id=message[idx][0],
                username=message[idx][1],
            )


def query_application_by_depart_nothandle(depart):
    '''
    查询某一部门所有人 主管未处理的申请(包括请假和加班)  
    Args: 
        depart: 部门名称
    Returns:
        两层list对象, 外层为该部门所有未处理的申请，
        内层为申请人，申请内容，申请时间, 'l_id'/'o_id', 请假号/加班号
    '''
    res = []
    emps = User.objects.filter(depart=depart)
    for e in emps:
        leaves = Leavee.objects.filter(l_emp=e, handle=False)
        for leave in leaves:
            temp = []
            temp.append(e.username)
            if leave.kind == 0:
                msg = '请假申请(事假): ' + leave.l_reason[:28]
            elif leave.kind == 1:
                msg = '请假申请(病假): ' + leave.l_reason[:28]
            else:
                msg = '请假申请(其他): ' + leave.l_reason[:28]
            temp.append(msg)
            temp.append(leave.apply_time.strftime("%Y-%m-%d"))
            temp.append('l_id')
            temp.append(leave.l_id)
            res.append(temp)
        overtimes = Overtime.objects.filter(o_emp=e, handle=False)
        for ovt in overtimes:
            temp = []
            temp.append(e.username)
            msg = '加班申请: ' + ovt.o_reason[:30]
            temp.append(msg)
            temp.append(ovt.ot_date.strftime("%Y-%m-%d"))
            temp.append('o_id')
            temp.append(ovt.o_id)
            res.append(temp)
    return res


def query_application_by_depart_hashandle(depart):
    '''
    查询某一部门所有人 主管已经处理的申请(包括请假和加班)  
    Args: 
        depart: 部门名称
    Returns:
        两层list对象, 外层为该部门所有已经处理的申请，
        内层为申请人，申请内容，申请时间
    '''
    res = []
    emps = User.objects.filter(depart=depart)
    for e in emps:
        leaves = Leavee.objects.filter(l_emp=e, handle=True)
        for leave in leaves:
            temp = []
            temp.append(e.username)
            if leave.kind == 0:
                msg = '请假申请(事假): ' + leave.l_reason[:28]
            elif leave.kind == 1:
                msg = '请假申请(病假): ' + leave.l_reason[:28]
            else:
                msg = '请假申请(其他): ' + leave.l_reason[:28]
            temp.append(msg)
            temp.append(leave.apply_time.strftime("%Y-%m-%d"))
            if leave.approved:
                appr = '已通过'
            else:
                appr = '已拒绝'
            temp.append(appr)
            res.append(temp)
        overtimes = Overtime.objects.filter(o_emp=e, handle=True)
        for ovt in overtimes:
            temp = []
            temp.append(e.username)
            msg = '加班申请: ' + ovt.o_reason[:30]
            temp.append(msg)
            temp.append(ovt.ot_date.strftime("%Y-%m-%d"))
            if ovt.approved:
                appr = '已通过'
            else:
                appr = '已拒绝'
            temp.append(appr)
            res.append(temp)
    return res


def pass_application(kind, nid):
    '''
    主管通过一个申请(可以是病假或者事假)
    Args:
        kind: 'l_id' / 'o_id'
        nid: 申请的id号
    Returns:
        void
    '''
    if kind == 'l_id':
        leave = Leavee.objects.get(l_id=nid)
        leave.approved = True
        leave.handle = True
        leave.save()
    elif kind == 'o_id':
        ovt = Overtime.objects.get(o_id=nid)
        ovt.approved = True
        ovt.handle = True
        ovt.save()
    else:
        raise Exception("??? 既不是请假也不是加班怎么传过来的")


def reject_application(kind, nid):
    '''
    主管拒绝一个申请(可以是病假或者事假)
    Args:
        kind: 'l_id' / 'o_id'
        nid: 申请的id号
    Returns:
        void
    '''
    if kind == 'l_id':
        p = Leavee.objects.get(l_id=nid)
        p.approved = False
        p.handle = True
        p.save()
        p = p.l_emp
    elif kind == 'o_id':
        p = Overtime.objects.get(o_id=nid)
        p.approved = False
        p.handle = True
        p.save()
        p = p.o_emp
    else:
        raise Exception("??? 既不是请假也不是加班怎么传过来的")
    return p

# query_ws(2020, 5, 1)


def create_casual(casual_start, casual_end, casual_reason):
    '''
    经理创建临时加班
    Args:
        casual_start:开始时间
        casual_end:结束时间
        casual_reason:加班理由
    Returns:
        void
    '''
    c_date = casual_start.date()
    sign = is_holiday(c_date)
    cas = Casual(c_reason=casual_reason, c_begin=casual_start,
                 c_end=casual_end, is_holiday=sign)
    cas.save()
    emps = User.objects.all()
    for e in emps:
        emp_cas = Emp_Casual(casual=cas, emp=e)
        emp_cas.save()


def add_Sche(kind, work_begin, work_end):
    '''
    部门主管添加一个新的班次种类  
    Args:
        三个参数为models.Sche中的属性
    Returns:

    '''
    sches = Sche.objects.all()
    for sche in sches:
        if kind == sche.kind:
            raise Exception("不要添加一个和已存在的工作班次一样的工作班次")
    new_sche = Sche(kind=kind, work_begin=work_begin, work_end=work_end)
    new_sche.save()


def geocode(location):
    import requests
    parameters = {
        'output': 'json',
        'key': '60f56b1549bef5a997ef2e708bf342e6',
        'location': location,
        'extensions': 'all',
    }
    base = 'http://restapi.amap.com/v3/geocode/regeo'
    response = requests.get(base, parameters)
    return response.json()


def check_scheEmp_isRight(eid):
    today = datetime.date.today()
    b = query_emp_sche_month(eid, today.year, today.month)
    b = b['sche']
    if len(b) == 0:
        return False
    b = b[today.day - 1]
    if len(b) == 2:
        return False
    else:
        e = User.objects.get(e_id=eid)
        sche = e.e_sche
        if int(sche.s_id) == b[-1]:
            return False
        else:
            e.e_sche_id = b[-1]
            return True


system = User.objects.get(username='root')
