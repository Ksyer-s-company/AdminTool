# Generated by Django 2.2.3 on 2020-06-10 17:01

from django.conf import settings
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import shortuuidfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('e_id', shortuuidfield.fields.ShortUUIDField(blank=True, editable=False, max_length=22, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=15, unique=True, verbose_name='?????????')),
                ('gender', models.CharField(blank=True, choices=[('1', '???'), ('2', '???')], default='', max_length=2, null=True, verbose_name='??????')),
                ('phone', models.CharField(blank=True, default='', max_length=11, null=True, verbose_name='????????????')),
                ('email', models.EmailField(default='', max_length=254, verbose_name='??????')),
                ('birth', models.DateTimeField(auto_now_add=True)),
                ('password', models.CharField(default='', max_length=128)),
                ('position', models.IntegerField(default=0, null=True, verbose_name='??????')),
                ('depart', models.IntegerField(default=0, null=True, verbose_name='??????')),
            ],
            options={
                'verbose_name': '??????',
                'verbose_name_plural': '??????',
            },
        ),
        migrations.CreateModel(
            name='Casual',
            fields=[
                ('c_id', models.AutoField(primary_key=True, serialize=False)),
                ('c_reason', models.TextField(blank=True, null=True)),
                ('c_begin', models.DateTimeField(blank=True, null=True)),
                ('c_end', models.DateTimeField(blank=True, null=True)),
                ('is_holiday', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'Casual',
            },
        ),
        migrations.CreateModel(
            name='Sche',
            fields=[
                ('s_id', models.AutoField(primary_key=True, serialize=False)),
                ('kind', models.CharField(max_length=10)),
                ('work_begin', models.TimeField(blank=True, null=True)),
                ('work_end', models.TimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Sche',
            },
        ),
        migrations.CreateModel(
            name='ScheHistory',
            fields=[
                ('sh_id', models.AutoField(primary_key=True, serialize=False)),
                ('change_time', models.DateField(blank=True, null=True)),
                ('change_sche', models.ForeignKey(db_column='change_sche', null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.Sche')),
                ('emp', models.ForeignKey(db_column='emp', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'ScheHistory',
            },
        ),
        migrations.CreateModel(
            name='Overtime',
            fields=[
                ('o_id', models.AutoField(primary_key=True, serialize=False)),
                ('ot_date', models.DateField(blank=True, null=True)),
                ('time_length', models.FloatField(blank=True, null=True)),
                ('o_reason', models.TextField(blank=True, null=True)),
                ('is_holiday', models.BooleanField(default=False)),
                ('approved', models.BooleanField(default=False)),
                ('handle', models.BooleanField(default=False)),
                ('o_emp', models.ForeignKey(db_column='o_emp', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Overtime',
            },
        ),
        migrations.CreateModel(
            name='Leavee',
            fields=[
                ('l_id', models.AutoField(primary_key=True, serialize=False)),
                ('l_begin', models.DateTimeField(blank=True, null=True)),
                ('l_end', models.DateTimeField(blank=True, null=True)),
                ('l_reason', models.TextField(blank=True, null=True)),
                ('kind', models.IntegerField(blank=True, null=True)),
                ('apply_time', models.DateTimeField(blank=True, null=True)),
                ('approved', models.BooleanField(default=False)),
                ('cancel', models.BooleanField(default=False)),
                ('handle', models.BooleanField(default=False)),
                ('l_emp', models.ForeignKey(db_column='l_emp', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Leavee',
            },
        ),
        migrations.CreateModel(
            name='Emp_Casual',
            fields=[
                ('ec_id', models.AutoField(primary_key=True, serialize=False)),
                ('casual', models.ForeignKey(db_column='casual', null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.Casual')),
                ('emp', models.ForeignKey(db_column='emp', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Emp_Casual',
            },
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('a_id', models.AutoField(primary_key=True, serialize=False)),
                ('clock_in', models.DateTimeField(blank=True, null=True)),
                ('ring_out', models.DateTimeField(blank=True, null=True)),
                ('theory_work_begin', models.TimeField(blank=True, null=True)),
                ('theory_work_end', models.TimeField(blank=True, null=True)),
                ('emp', models.ForeignKey(db_column='emp', null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Attendance',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='e_sche',
            field=models.ForeignKey(db_column='e_sche', default='', null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.Sche'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
