from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse, JsonResponse
from django.core.paginator import Paginator
import datetime
from .utils import *
import json
import codecs
import re
import math
import csv
from pprint import pprint
from notifications.signals import notify
from django.contrib.auth.decorators import login_required
import base64
import urllib.request
import urllib.parse
import time
from django.contrib import auth

root = User.objects.get(username='root')


@login_required
def index(request):
    return render(request, 'main/index.html')


def manager_home(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    content = {
        'username': user.username,
        'emp_id': user.e_id
    }
    return render(request, 'main/manager_home.html', content)


def emp_home(request):
    eid = request.COOKIES.get('eid')
    user = query_oneemp_by_id(int(eid))
    content = {
        'username': user[1],
        'emp_id': user[0],
        'depart': user[2],
        'position': user[3],
    }
    return render(request, 'main/emp_home.html', content)


def supervisor_home(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    content = {
        'username': user.username,
        'emp_id': user.e_id,
        'depart': user.depart
    }
    return render(request, 'main/supervisor_home.html', content)


def emp_delete(request):
    if request.method == 'POST':
        size = request.POST.get('len')
        for i in range(int(size)):
            eid = request.POST.get('emp_id' + str(i))
            if eid:
                delete_oneemp_by_id(eid)
    return redirect('emp_manage.html')


def emp_edit(request):
    eid = request.GET.get('emp_id')
    msg = query_oneemp_by_id(eid)
    error = ''
    sign = False
    content = {
        'msg': msg,
        'errors': error,
    }
    if request.method == 'POST':
        sign = False
        emp_id = request.POST.get('emp_id')
        emp_name = request.POST.get('emp_name')
        emp_depart = request.POST.get('emp_depart')
        emp_pos = int(request.POST.get('emp_pos'))
        if not emp_name:
            content['errors'] = '员工姓名不能为空！'
            sign = True
        if emp_pos == 1:
            if User.objects.filter(depart=emp_depart, position=1).exists():
                content['errors'] = '该部门已有主管!'
                sign = True
        if sign:
            content['signs'] = sign
            return render(request, 'main/emp_edit.html', content)
        else:
            edit_emp_infor(emp_id, emp_name, emp_depart, emp_pos)
            return redirect('emp_manage.html')
    return render(request, 'main/emp_edit.html', content)


def emp_new(request):
    if request.method == 'POST':
        sign = False
        error = ''
        newemp_name = request.POST.get('newemp_name')
        newemp_depart = request.POST.get('newemp_depart')
        newemp_pos = int(request.POST.get('newemp_pos'))
        if not newemp_name:
            error = '员工姓名不能为空！'
            sign = True
        if User.objects.filter(depart=newemp_depart, position=1).exists() and newemp_pos == 1:
            error = '该部门已有主管！'
            sign = True
        if not sign:
            new_emp(newemp_name, newemp_depart, newemp_pos)
            error = '新建成功！'
            sign = True
        content = {
            'errors': error,
            'msg_js': json.dumps(error),
            'signs': sign
        }
        return render(request, 'main/emp_new.html', content)
    return render(request, 'main/emp_new.html')


def import_perform_1(request):
    return render(request, 'main/import_perform_1.html')


def import_perform_2(request):
    return render(request, 'main/import_perform_2.html')


def import_not_list(request):
    # unimportable_list = request.GET.get('unimportable_list', None)
    return render(request, 'main/import_not_list.html', {"unimportable_list": unimportable_list})


def import_finish(request):
    return render(request, 'main/import_finish.html')


def attendance_summary(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    current_page = int(request.GET.get('page', 1))
    global a_year, a_month, a_id, a_pos, a_depart
    ym = request.GET.get('ym', '')
    a_id = request.GET.get('id', '')
    a_pos = request.GET.get('pos', '')
    a_depart = request.GET.get('depart', '')

    if not ym:
        a_year = datetime.datetime.today().year
        a_month = datetime.datetime.today().month
    else:
        a_year, a_month = ym.split('-')
        a_year, a_month = int(a_year), int(a_month)

    if not a_id and not a_pos and not a_depart:
        print("*******************************")
        msgs = query_month_attendance_all(a_year, a_month)
    else:
        print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
        msgs = query_month_attendance_condition(
            a_year, a_month, a_id, a_pos, a_depart)

    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)

    departnames = query_depart_name()
    content = {
        'msgs': msgs,
        'current_page': current_page,
        'max_page': page.num_pages,
        'departnames': departnames,
        'ym': ym,
        'id': a_id,
        'pos': a_pos,
        'depart': a_depart,
        'username': username,
    }
    return render(request, 'main/attendance_summary.html', content)


def attendance_summary_supervisor(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    current_page = int(request.GET.get('page', 1))
    depart = request.COOKIES['depart']
    global as_year, as_month, as_id, as_pos
    ym = request.GET.get('ym', '')
    as_id = request.GET.get('id', '')
    as_pos = request.GET.get('pos', '')

    if not ym:
        as_year = datetime.datetime.today().year
        as_month = datetime.datetime.today().month
    else:
        as_year, as_month = ym.split('-')
        as_year, as_month = int(as_year), int(as_month)

    if not as_id and not as_pos:
        msgs = query_month_attendance_by_dapart(depart, as_year, as_month)
    else:
        msgs = query_month_attendance_condition(
            as_year, as_month, as_id, as_pos, depart)
    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)
    content = {
        'msgs': msgs,
        'current_page': current_page,
        'max_page': page.num_pages,
        'ym': ym,
        'id': as_id,
        'pos': as_pos,
        'username': username,
    }
    return render(request, 'main/attendance_summary_supervisor.html', content)


def schedule_manage(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    current_page = int(request.GET.get('page', 1))
    depart = request.COOKIES['depart']
    global sm_id, sm_sche
    sm_id = request.GET.get('id', '')
    sm_sche = request.GET.get('sche', '')

    if not sm_id and not sm_sche:
        msgs = query_all_sche_by_depart(depart)
    else:
        msgs = query_all_sche_by_depart_condition(depart, sm_id, sm_sche)

    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)

    schenames = query_sche_name()
    emp_id = [m[0] for m in msgs]
    msgs_forjs = json.dumps(emp_id)
    content = {
        'current_page': current_page,
        'max_page': page.num_pages,
        'msgs': msgs,
        'p': [0]*len(msgs),
        'schenames': schenames,
        'id': sm_id,
        'sche': sm_sche,
        'msgs_forjs': msgs_forjs,
        'depart': depart,
        'username': username,
    }
    return render(request, 'main/schedule_manage.html', content)


def schedule_manage_paste(request):
    eid = int(request.GET.get('eid'))
    sid = int(request.GET.get('sid'))
    print(eid, sid)
    update_emp_sche_forever(eid, sid, 0, 0)
    return redirect('schedule_manage.html')


def schedule_new(request):
    return render(request, 'main/schedule_new.html')


def schedule_edit_1(request):
    if request.method == 'GET':
        eid = request.GET.get('eid')
        e = query_oneemp_by_id(eid)
        msg = [e[0], e[1]]
        sches = query_all_sche_kind()
    return render(request, 'main/schedule_edit_1.html', locals())


def sche_change_forver(request):
    if request.method == 'POST':
        eid = request.POST.get('emp_id')
        sid = request.POST.get('sche_id')
        workbegin = request.POST.get('work_begin')
        workend = request.POST.get('work_end')
        update_emp_sche_forever(int(eid), int(sid), workbegin, workend)
    return redirect('schedule_manage.html')


def sche_change_temp(request):
    if request.method == 'POST':
        eid = request.POST.get('emp_id')
        sid = request.POST.get('sche_id')
        workbegin = request.POST.get('work_begin')
        workend = request.POST.get('work_end')
        duration_begin = request.POST.get('duration_begin')
        duration_end = request.POST.get('duration_end')
        update_emp_sche_temp(int(eid), int(sid),
                             workbegin, workend, duration_begin, duration_end)
    return redirect('schedule_manage.html')


def schedule_edit_2(request):
    return render(request, 'main/schedule_edit_2.html')


def schedule_creat(request):
    if request.method == 'POST':
        kind = request.POST.get('kind')
        work_begin = request.POST.get('work_begin')
        work_end = request.POST.get('work_end')
        try:
            add_Sche(kind, work_begin, work_end)
        except Exception as e:
            sign = True
            error = str(e)
            content = {
                'sign': sign,
                'error': error
            }
            return render(request, 'main/schedule_creat.html', content)
        else:
            redirect('supervisor_home.html')
    return render(request, 'main/schedule_creat.html')


def import_perform_schedule(request):
    return render(request, 'main/import_perform_schedule.html')


def import_finish_schedule(request):
    return render(request, 'main/import_finish_schedule.html')


def schedule_edit_batch(request):
    if request.method == 'POST':
        size = int(request.POST.get('len'))
        eids = []
        for i in range(size):
            eid = request.POST.get('emp_id' + str(i))
            if eid:
                eids.append(eid)
        sches = query_all_sche_kind()
        content = {
            'eids': eids,
            'sches': sches
        }
    return render(request, 'main/schedule_edit_batch.html', content)


def dealwith_schedule_edit_batch(request):
    if request.method == 'POST':
        for i in range(10):
            eid = request.POST.get('eid' + str(i))
            if eid:
                sid = request.POST.get('s_kind')
                workbegin = request.POST.get('work_begin')
                workend = request.POST.get('work_end')
                update_emp_sche_forever(int(eid), int(sid), workbegin, workend)
    return redirect('schedule_manage.html')


def schedule_summary_1(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    current_page = int(request.GET.get('page', 1))
    global ss1_year, ss1_month, ss1_day, ss1_id, ss1_depart, ss1_sche
    ymd = request.GET.get('ymd', '')
    ss1_id = request.GET.get('id', '')
    ss1_sche = request.GET.get('sche', '')
    ss1_depart = request.GET.get('depart', '')

    if not ymd:
        today = datetime.datetime.today()
        ss1_year, ss1_month, ss1_day = today.year, today.month, today.day
    else:
        ss1_year, ss1_month, ss1_day = ymd.split('-')
        ss1_year, ss1_month, ss1_day = int(
            ss1_year), int(ss1_month), int(ss1_day)

    if not ss1_id and not ss1_depart and not ss1_sche:
        msgs = query_oneday_sche(ss1_year, ss1_month, ss1_day)
    else:
        msgs = query_oneday_sche_condition(ss1_id, ss1_depart,
                                           ss1_year, ss1_month, ss1_day)

    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)

    schenames = query_sche_name()
    departnames = query_depart_name()
    content = {
        'msgs': msgs,
        'current_page': current_page,
        'max_page': page.num_pages,
        'departnames': departnames,
        'schenames': schenames,
        'ymd': ymd,
        'id': ss1_id,
        'sche': ss1_sche,
        'depart': ss1_depart,
        'username': username
    }
    return render(request, 'main/schedule_summary_1.html', content)


def get_calendar(emp_id, year, month):
    cal = calendar.monthcalendar(year, month)
    Id = 7 - len(cal)
    sche_historys = ScheHistory.objects.filter(emp=emp_id)

    if len(sche_historys) == 0:
        error = '该员工尚未安排排班'
        content = {
            'error': error
        }
        return content, Id
    his = []
    for sche_history in sche_historys:
        his.append(sche_history.change_time)

    now_day = datetime.date(year, month, day=1)

    init_sche = -1
    while now_day >= datetime.date(2020, 5, 1):
        now_day = now_day + timedelta(days=-1)
        if now_day in his:
            init_sche = ScheHistory.objects.filter(
                emp=emp_id, change_time=now_day)
            break

    if init_sche == -1:
        ret = calendar.monthcalendar(year, month)
        cal2 = calendar.monthcalendar(year, month)
        f = 0

        X = []
        idx = 0
        wb, we = 0, 0
        now_day = datetime.date(year, month, day=1)
        while now_day <= datetime.date(year, month + 1, day=1):
            now_day = now_day + timedelta(days=1)
            if idx == 0:
                while now_day not in his:
                    now_day = now_day + timedelta(days=1)
                    X.append((-1, -1))
                idx = 1

            if idx and now_day in his:
                kind = ScheHistory.objects.filter(change_time=now_day, emp=emp_id)[0]
                wb = kind.change_sche.work_begin
                we = kind.change_sche.work_end
                X.append((wb, we))
                idx += 1
            elif idx:
                X.append((wb, we))
        
        f = 0
        for i in range(len(ret)):
            for j in range(len(ret[0])):
                if X[ cal2[i][j] ] != (-1, -1) and X[ cal2[i][j] ] != (0, 0):
                    f = 1
                if f == 1:
                    ret[i][j] = X[ cal[i][j] ]
                else:
                    ret[i][j] = (-1, -1)
                if cal2[i][j] == 0 and f:
                    ret[i][j] = (0, 0)
                    

        content = {
            'cal2': cal2,
            'ret': ret
        }
        return content, Id
    for i in init_sche:
        idx = i.change_sche
    tmps = Sche.objects.filter(kind=idx)
    for tmp in tmps:
        init_wm = {
            'wm_kind': tmp.kind,
            'wm_begin': tmp.work_begin,
            "wm_end": tmp.work_end,
        }

    this_month_ws = query_ws(init_wm, year, month, emp_id)
    wm_begin, wm_end = [0], [0]

    for week in cal:
        for day in week:
            if day == 0:
                continue
            this_day = datetime.date(year, month, day)
            x = this_month_ws[str(this_day)]
            wm_begin.append(x['wm_begin'])
            wm_end.append(x['wm_end'])

    ret = cal.copy()
    for i in range(len(ret)):
        for j in range(len(ret[0])):
            if cal[i][j] == 0:
                ret[i][j] = (0, 0)
            else:
                ret[i][j] = (wm_begin[cal[i][j]], wm_end[cal[i][j]])
    content = {
        'cal2': calendar.monthcalendar(year, month),
        'ret': ret
    }
    return content, Id

def get_calendar2(emp_id, year, month):
    pass


def schedule_summary_2(request):
    emp_id = int(request.GET.get('e_id', 1))
    year = int(request.GET.get('year', 2020))
    month = int(request.GET.get('month', 8))
    content, Id = get_calendar(emp_id, year, month)
    ret = {
        'emp_id': emp_id,
        'year': year,
        'month': month,
        'cal2': content['cal2'],
        'ret': content.get('ret', ''),
        'error': content.get('error', ''),
    }
    return render(request, 'main/schedule_summary_%d.html' % (Id + 1), ret)


def schedule_summary_3(request):
    emp_id = int(request.GET.get('e_id', 1))
    year = int(request.GET.get('year', 2020))
    month = int(request.GET.get('month', 5))
    content, Id = get_calendar(emp_id, year, month)
    ret = {
        'emp_id': emp_id,
        'year': year,
        'month': month,
        'cal2': calendar.monthcalendar(year, month),
        'ret': content['ret']
    }
    return render(request, 'main/schedule_summary_%d.html' % (Id + 1), ret)


def clock_finish(request):
    return render(request, 'main/clock_finish.html')


def clock_repeat(request):
    return render(request, 'main/clock_repeat.html')


def leave(request):
    eid = int(request.COOKIES["eid"])
    empinfor = query_empmsg_id(eid)
    if request.method == 'POST':
        eid = int(request.COOKIES["eid"])
        kind = request.POST.get('kind')
        l_begin = request.POST.get('l_begin')
        l_end = request.POST.get('l_end')
        l_reason = request.POST.get('l_reason')

        msg = ''
        if not l_begin:
            msg = '未填写开始时间, 提交失败'
        elif not l_end:
            msg = '未填写结束时间, 提交失败'
        elif not l_reason:
            msg = '未填写原因, 提交失败'
        else:
            try:
                add_Leave(eid, l_begin, l_end, l_reason, kind)
            except Exception as e:
                msg = str(e)
            else:
                temp = User.objects.get(depart=request.user.depart, position=1)
                if temp.is_notify:
                    notify.send(
                        root,
                        recipient=temp,
                        verb='员工 %s 提交了请假申请，请前往审批页面进行审批' % (
                            User.objects.get(e_id=eid).username),
                        description='supervisor_approve.html',
                    )
                msg = '提交成功, 等待审核'
        return render(request, 'main/leave.html', {'msg': msg, 'sign': True, 'empinfor': empinfor})
    return render(request, 'main/leave.html', {'empinfor': empinfor})


def overtime(request):
    eid = int(request.COOKIES["eid"])
    empinfor = query_empmsg_id(eid)
    if request.method == 'POST':
        msg = ''
        sign = False
        start_ot_str = request.POST.get('start_ot')
        end_ot_str = request.POST.get('end_ot')
        reason_ot = request.POST.get('reason_ot')
        try:
            start_ot = datetime.datetime.strptime(
                start_ot_str, '%Y-%m-%d %H:%M')
            end_ot = datetime.datetime.strptime(
                end_ot_str, '%Y-%m-%d %H:%M')
        except Exception as e:
            msg = '输入格式有误!'
            sign = True
        else:
            time_len = (end_ot - start_ot).seconds
            time_len = float(('%.2f' % (time_len / 3600)))
            date_ot = start_ot.date()
            if not reason_ot:
                msg = '加班理由不能为空！'
                sign = True
            if end_ot <= start_ot:
                msg = '结束时间过早，输入有误！'
                sign = True
            if not sign:
                add_overtime(eid, time_len, reason_ot, date_ot)

                temp = User.objects.get(depart=request.user.depart, position=1)
                if request.user.is_notify:
                    notify.send(
                        root,
                        recipient=temp,
                        verb='员工 %s 提交了加班申请，请前往审批页面进行审批' % (
                            User.objects.get(e_id=eid).username),
                        description='supervisor_approve.html',
                    )
                msg = '提交成功！'
                sign = True
        content = {
            'msgs': msg,
            'signs': sign,
            'empinfor': empinfor
        }
        return render(request, 'main/overtime.html', content)
    return render(request, 'main/overtime.html', {'empinfor': empinfor})


def cancel_leave(request):
    lid = request.GET.get('l_id')
    if request.method == 'POST':
        sign = False
        msg = ''
        cancel_l_end = request.POST.get('cancel_date')
        try:
            cancel_l_end = datetime.datetime.strptime(
                cancel_l_end, '%Y-%m-%d %H:%M')
        except Exception as e:
            msg = '输入格式有误!'
            sign = True
        else:
            if update_cancel_date(lid, cancel_l_end):
                return redirect('cancel_leave_manage.html')
            else:
                msg = '结束时间过早，输入有误！'
                sign = True
        content = {
            'msgs': msg,
            'signs': sign
        }
        return render(request, 'main/cancel_leave.html', content)
    return render(request, 'main/cancel_leave.html')


def cancel_leave_manage(request):
    eid = int(request.COOKIES["eid"])
    empinfor = query_empmsg_id(eid)
    lastfive = query_last_five_leave(eid)
    not_cancel_leaves = query_notcancel_leave(eid)
    current_page = int(request.GET.get('page', 1))
    page = Paginator(not_cancel_leaves, 4)
    not_cancel_leaves = page.get_page(current_page)
    content = {
        'lastfive': lastfive,
        'not_cancel_leaves': not_cancel_leaves,
        'current_page': current_page,
        'max_page': page.num_pages,
        'empinfor': empinfor
    }
    return render(request, 'main/cancel_leave_manage.html', content)


def submit_finish(request):
    return render(request, 'main/submit_finish.html')


def casual_overtime(request):
    eid = int(request.COOKIES["eid"])
    empinfor = query_empmsg_id(eid)
    departname = query_depart_name()
    sign = False
    msg = ''
    if request.method == 'POST':
        casual_start = request.POST.get('casual_start')
        casual_end = request.POST.get('casual_end')
        casual_reason = request.POST.get('casual_reason')
        casual_depart = request.POST.get('casual_depart')
        try:
            casual_start = datetime.datetime.strptime(
                casual_start, '%Y-%m-%d %H:%M')
            casual_end = datetime.datetime.strptime(
                casual_end, '%Y-%m-%d %H:%M')
        except Exception as e:
            msg = '开始结束时间输入格式有误!'
            sign = True
        else:
            if not casual_reason:
                msg = '加班理由不能为空！'
                sign = True
            if not sign:
                create_casual(casual_start, casual_end, casual_reason)

                for i in User.objects.all():
                    if i.position == 0:
                        continue
                    if i.is_notify:
                        notify.send(
                            root,
                            recipient=i,
                            verb='经理创建了全单位加班活动，请注意查收',
                            description='read_message?id=%d' % i.e_id,
                        )

                sign = True
                msg = '创建成功！'
    content = {
        'departnames': departname,
        'signs': sign,
        'msgs': msg,
        'empinfor': empinfor
    }
    return render(request, 'main/casual_overtime.html', content)


def create_finish(request):
    return render(request, 'main/create_finish.html')


def supervisor_approve(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    depart = request.COOKIES['depart']
    msgs = query_application_by_depart_nothandle(depart)
    current_page = int(request.GET.get('page', 1))
    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)
    content = {
        'msgs': msgs,
        'current_page': current_page,
        'max_page': page.get_page,
        'username': username,
    }
    return render(request, 'main/supervisor_approve.html', content)


def approve_pass(request):
    kind = request.GET.get('kind')
    approve_id = int(request.GET.get('id'))
    pass_application(kind, approve_id)
    if kind == 'l_id':
        x = Leavee.objects.get(l_id=approve_id).l_emp
        depart_name = x.depart
        temp = User.objects.filter(depart=depart_name, position=1)
        username = x.username
    elif kind == 'o_id':
        x = Overtime.objects.get(o_id=approve_id).o_emp
        depart_name = x.depart
        temp = User.objects.filter(depart=depart_name, position=1)
        username = x.username

    strs = {
        'l_id': '请假',
        'o_id': '加班',
    }
    temp = temp[0]
    if temp.is_notify:
        notify.send(
            root,
            recipient=temp,
            verb='员工 %s 的 %s 申请被批准，请及时调整员工的工作安排' % (username, strs[kind]),
            description='supervisor_approve.html',
        )
    if x.is_notify:
        notify.send(
            root,
            recipient=x,
            verb='您的 %s 申请被批准' % (strs[kind]),
            description='emp_home.html',
        )
    return redirect('supervisor_approve.html')


def application(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    return render(request, 'main/application.html', {'username': username})


def application_reject(request):
    if request.method == 'POST':
        kind = request.POST.get('kind')
        approve_id = int(request.POST.get('id'))
        reason = request.POST.get('reason')
        print(kind, approve_id, reason)
        temp = reject_application(kind, approve_id)
        strs = {
            'l_id': '请假',
            'n_id': '加班',
        }
        
        e_id = int(request.COOKIES.get('e_id', 0))

        if e_id != 0:
            rejecter = User.objects.get(e_id=e_id)
            if rejecter.is_notify:
                notify.send(
                    root,
                    recipient=rejecter,
                    verb='员工 %s 的 %s 申请被拒绝' % (temp.username, strs[kind]),
                    description='supervisor_approve.html',
                )
        
        if temp.is_notify:
            notify.send(
                root,
                recipient=temp,
                verb='您的 %s 申请被拒绝' % strs[kind],
                description='supervisor_approve.html',
            )


        return redirect('supervisor_approve.html')
    return render(request, 'main/application_reject.html')


def application_approved(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    depart = request.COOKIES['depart']
    msgs = query_application_by_depart_hashandle(depart)
    current_page = int(request.GET.get('page', 1))
    page = Paginator(msgs, 10)
    msgs = page.get_page(current_page)
    content = {
        'msgs': msgs,
        'current_page': current_page,
        'max_page': page.num_pages,
        'username': username,
    }
    return render(request, 'main/application_approved.html', content)


def my_schedule(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    emp_id = int(request.COOKIES.get('eid', '0'))
    y, m, d = str(datetime.datetime.now())[:10].split('-')
    year = int(request.COOKIES.get('y', y))
    month = int(request.COOKIES.get('m', m))
    content, Id = get_calendar(emp_id, year, month)
    content['username'] = username
    return render(request, 'main/my_schedule_%d.html' % Id, content)


def my_account(request):
    eid = int(request.COOKIES["eid"])
    msg = query_empmsg_id(eid)
    content = {
        'msg': msg,
    }
    return render(request, 'main/my_account.html', content)


def account_edit(request):
    eid = int(request.COOKIES["eid"])
    msg = query_empmsg_id(eid)
    error = ''
    sign = False
    if request.method == 'POST':
        myemail = request.POST.get('myemail')
        myphone = request.POST.get('myphone')
        if len(myphone) != 11:
            error = '手机号长度应为11位！'
            sign = True
        if not sign:
            update_personal_msg(eid, myemail, myphone)
            return redirect('my_account.html')
    content = {
        'msg': msg,
        'errors': error,
    }
    return render(request, 'main/account_edit.html', content)


def password_edit(request):
    eid = int(request.COOKIES["eid"])
    msg = query_empmsg_id(eid)
    username = msg[0]
    print(msg)
    error = ''
    if request.method == 'POST':
        oldpwd = request.POST.get('oldpwd')
        newpwd = request.POST.get('newpwd')
        ispwd = request.POST.get('ispwd')
        user = auth.authenticate(username=username, password=oldpwd)
        print(oldpwd)
        print(newpwd)
        print(ispwd)
        print(user)
        if newpwd != ispwd:
            error = '密码确认有误！'
        if len(newpwd) < 1 or len(newpwd) > 16:
            error = '密码长度应为1-16位！'
        if not user:
            error = '原密码输入有误！'
        if not error:
            update_personal_pwd(eid, newpwd)
            return redirect('my_account.html')

    return render(request, 'main/password_edit.html', locals())

# def favicon(request):
#   return render(request, 'favicon.ico')


def upload_emp_info(request):
    request.encoding = 'utf-8'
    f = request.FILES.get('file', None)
    sign = False
    inerror = ''
    try:
        messages = readcsv(f)
    except:
        error = '请上传正确的csv文件'
        return render(request, 'import_perform_1.html', {'error': error})
    else:
        num_importable = 0
        global importable_list, unimportable_list
        importable_list, unimportable_list = [], []
        del messages[0]
        del messages[len(messages)-1]
        del_temp = []
        for message in messages:
            for i in range(len(message)):
                message[i] = str(message[i])[2:-1]
                if i == len(message) - 1:
                    del message[i]
            if message[0] == '' or message[1] == '':
                del_temp.append(message)
        for temp in del_temp:
            messages.remove(temp)
        for message in messages:
            sign = False
            inerror = ''
            if User.objects.filter(depart=message[3], position=1).exists() and message[2] == 1:
                inerror = '该部门已有主管'
                sign = True
            if User.objects.filter(username=message[0]).exists():
                inerror = '姓名已存在'
                sign = True
            if not message[0]:
                inerror = '姓名不能为空'
                sign = True
            message.append(inerror)
            if sign:
                unimportable_list.append(message)
            else:
                importable_list.append(message)

        importable_list2 = []
        for item in importable_list:
            if item not in importable_list2:
                importable_list2.append(item)

        unimportable_list2 = []
        for item in unimportable_list:
            if item not in unimportable_list2:
                unimportable_list2.append(item)

        num_unimportable = len(unimportable_list2)
        num_importable = len(importable_list2)
        importable_list = importable_list2
        unimportable_list = unimportable_list2

    return render(request, 'import_perform_2.html', locals())


@login_required
def emp_manage(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    current_page = int(request.GET.get('page', 1))

    global g_id, g_pos, g_depart

    dict = {
        '未选择': -1,
        '经理': 0,
        '部门主管': 1,
        '员工': 2,
    }

    g_id = ''
    g_pos = ''
    g_depart = ''

    if g_id == '':
        g_id = request.GET.get('id', '')
    if g_pos == '':
        g_pos = request.GET.get('pos', '')
    if g_depart == '':
        g_depart = request.GET.get('depart', '')

    cond_1 = (g_id == '')
    cond_2 = (g_pos == '未选择' or g_pos == '')
    cond_3 = (g_depart == '')

    if cond_1 and cond_2 and cond_3:
        msgs = query_emp_all()
        page = Paginator(msgs, 10)
        msgs = page.get_page(current_page)
        emp_id = [m[0] for m in msgs]
        p = [0] * len(msgs)
        msgs_forjs = json.dumps(emp_id)
        max_page = page.num_pages
    else:
        x = []
        if g_id == '':
            g_id = 0

        x1 = User.objects.filter(e_id=g_id)
        x2 = User.objects.filter(position=dict[g_pos])
        x3 = User.objects.filter(depart=g_depart)

        x1, x2, x3 = set(x1), set(x2), set(x3)

        S = x1 | x2 | x3
        for s in [x1, x2, x3]:
            if len(s) > 0:
                S = S & s
        x = list(S)

        msgs = []
        for a in x:
            msgs.append(a.info())
        emp_id = [m[0] for m in msgs]

        page = Paginator(msgs, 10)
        max_page = page.num_pages
        msgs = page.get_page(current_page)
        p = [0] * len(msgs)

        pos = g_pos
        id = g_id
        depart = g_depart

    return render(request, 'main/emp_manage.html', locals())


def import_all(request):
    global importable_list, unimportable_list
    for importable_people in importable_list:
        if len(User.objects.filter(e_id=importable_people[1])) != 0:
            edit_emp_infor(
                str(importable_people[1]),
                str(importable_people[0]),
                str(importable_people[3]),
                int(importable_people[2]),
            )
        else:
            new_emp(
                str(importable_people[1]),
                str(importable_people[0]),
                str(importable_people[3]),
                int(importable_people[2]),
            )
    importable_list, unimportable_list = [], []
    return render(request, 'import_finish.html')


def search_schedule(request):
    eeid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eeid))
    username = user.username
    global e_id
    if request.method == 'GET':
        e_id = int(request.GET.get('eid', 0))
        is_notify = request.GET.get('is_notify', '1')
        if is_notify == '取消提醒':
            user.is_notify = 1
        else:
            user.is_notify = 0
        user.save()
        ymd = request.GET.get('ymd', '0000-00-00')
        if ymd == '0000-00-00' or ymd == '':
            ymd = datetime.date.today()
        year, month, day = str(ymd).split('-')
        year, month, day = int(year), int(month), int(day)
        content, Id = get_calendar(e_id, year, month)
        content['is_notify'] = user.is_notify
        content['username'] = username
        return render(request, 'main/my_schedule_%d.html' % Id, content)

    if request.method == 'POST':
        date = request.POST.get('date', '0000-00')
        year, month = date.split('-')
        eid = request.COOKIES['eid']
        year, month = int(year), int(month)
        content, Id = get_calendar(eid, year, month)
        content['username'] = username
        return render(request, 'main/my_schedule_%d.html' % Id, content)


def clock_in(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    return render(request, 'clock_in.html', {'username': username})


def posturl(url, headers, data={}):
    try:
        params = json.dumps(data).encode(encoding='UTF8')
        req = urllib.request.Request(url, params, headers)
        r = urllib.request.urlopen(req)
        html = r.read()
        r.close()
        return html.decode("utf8")
    except urllib.error.HTTPError as e:
        print(e.code)
        print(e.read().decode("utf8"))
    time.sleep(1)


def distance_cal(emp_id, lat2, lag2):
    user = User.objects.get(e_id=emp_id)
    dist = ((lat2 - user.theory_lat) ** 2 + (lag2 - user.theory_lag) ** 2) ** 0.5
    print(dist)
    return dist

def loginFaceCheck(request):
    canLogin = False
    AuthName = '未验证用户'
    if request.method == "POST" and request.is_ajax():
        faceImage = request.POST.get('faceImg')
        index = faceImage.find('base64,')
        base64Str = faceImage[index + 6:]
        img = base64.b64decode(base64Str)
        BASE_LOGIN_LEFT_PATH = '/home/ksyer/桌面/1/'
        backupDate = time.strftime("%Y%m%d_%H%M%S")
        fileName = BASE_LOGIN_LEFT_PATH + "LeftImg_%s.jpg" % (backupDate)
        file = open(fileName, 'wb')
        file.write(img)
        file.close()

        with open(fileName, 'rb') as f:
            image = f.read()
            image_base64 = str(base64.b64encode(image), encoding='utf-8')

        data = {
            'image': image_base64,
            'image_type': 'BASE64',
            'group_id_list': '1',
        }

        headers = {'content-type': 'application/json'}
        request_url = 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=24.358bf3e284ed0e3101c6eea5aef99db0.2592000.1594553548.282335-20373008'

        html = posturl(request_url, data=data, headers=headers)
        html = json.loads(html)
        name = html['result']['user_list'][0]['user_id']

        eid = int(request.COOKIES.get('eid', 0))

        # if name == get_name_by_id(eid):
        if name == 'ty':
            canLogin = True
            AuthName = name
        x = distance_cal(2, float(lat), float(lag))
        print(x)
        if x < 100:
            attendance_list = Attendance.objects.filter(emp=eid)
            today = datetime.date.today()
            is_clocked = 0
            for obj in attendance_list:
                if str(today) in str(obj.clock_in):
                    o = obj
                    is_clocked = 1

            if is_clocked == 0:
                user = User.objects.filter(e_id=eid)[0]
                sche = Sche.objects.filter(kind=user.e_sche)[0]
                Attendance.objects.create(
                    emp=user,
                    clock_in=datetime.datetime.now(),
                    theory_work_begin=sche.work_begin,
                    theory_work_end=sche.work_end,
                )

            else:
                for obj in attendance_list:
                    if is_clocked and (obj.ring_out == '' or obj.ring_out == None):
                        JsonBackInfo = {
                            "canLogin": canLogin,
                            "AuthName": AuthName,
                            "is_clocked": 0,
                        }
                        obj.ring_out = datetime.datetime.now()
                        obj.save()
                        return JsonResponse(JsonBackInfo)
        else:
            canLogin = False
            AuthName = '地理信息异常'
            is_clocked = 1

        JsonBackInfo = {
            "canLogin": canLogin,
            "AuthName": AuthName,
            "is_clocked": is_clocked,
        }
        print(JsonBackInfo)
        return JsonResponse(JsonBackInfo)
    return render(request, 'clock_in.html')

def getLocation(request):
    if request.method == "POST" and request.is_ajax():
        global lat, lag
        lat, lag = 0, 0
        lat = request.POST.get('lat')
        lag = request.POST.get('lag')
        JsonBackInfo = {
            'json': '123'
        }
        return JsonResponse(JsonBackInfo)
    

def csv_download(request):
    response = HttpResponse(content_type='text/csv;charset=UTF-8')
    response.write(codecs.BOM_UTF8)
    response['Content-Disposition'] = 'attachment; filename="ImportModel.csv"'
    writer = csv.writer(response)
    writer.writerow(['姓名', '工号', '职务', '所属部门',
                     '注：在所属列填写员工信息即可,一行为一员工,职务1为主管2为员工'])
    return response


def export_departmentAllEmp_sche(request):
    depart = request.COOKIES['depart']
    response = HttpResponse(content_type='text/csv;charset=UTF-8')
    # response.write(codecs.BOM_UTF8)
    today = datetime.date.today()
    response['Content-Disposition'] = 'attachment; filename="export_' + \
        str(today) + '.scheinfo"'
    writer = csv.writer(response)
    infos = query_all_sche_by_depart(depart)
    for info in infos:
        writer.writerow([info[0], info[-1]])
    return response


def upload_sche_info(request):
    request.encoding = 'utf-8'
    f = request.FILES.get('file', None)
    if f == None:
        error = '请上传文件'
        return render(request, 'import_perform_schedule.html', {'error': error})
    else:
        f_name = str(f)
        file_kind = f_name.split('.')[-1]
        if file_kind != 'scheinfo':
            error = '请上传正确的文件'
            return render(request, 'import_perform_schedule.html', {'error': error})
        else:
            messages = readcsv(f)
            print(messages)
            for m in messages:
                try:
                    eid = int(m[0])
                    sid = int(m[1])
                except:
                    continue
                else:
                    update_emp_sche_forever(eid, sid, 0, 0)
            return redirect('import_finish_schedule.html')


def get_name_by_id(e_id):
    for item in User.objects.filter(e_id=e_id):
        return item.username


def return_to_home(request):
    eid = request.COOKIES.get('eid', 0)
    for item in User.objects.filter(e_id=int(eid)):
        pos = item.position
        if pos == 0:
            return redirect('manager_home.html')
        elif pos == 1:
            return redirect('supervisor_home.html')
        elif pos == 2:
            return redirect('emp_home.html')
        else:
            return render(request, 'my_account.html')


def fault(request):
    return render(request, 'main/fault.html')


'''
def page_not_found(request, exception, template_name='fault.html'):
    print(1243435345)
    return render(request, template_name)

def page_error(request):
    print(9880970978)
    return render(request, 'fault.html')
'''


def ring_out(request):
    eid = request.COOKIES.get('eid')
    user = User.objects.get(e_id=int(eid))
    username = user.username
    return render(request, 'main/ring_out.html', {'username': username})


def ring_repeat(request):
    return render(request, 'main/ring_repeat.html')


def ring_finish(request):
    return render(request, 'main/ring_finish.html')


def message(request):
    eid = int(request.COOKIES.get('eid', 0))
    user = User.objects.get(e_id=eid)
    current_page = int(request.GET.get('page', 1))
    notes = []
    for i in user.notifications.all():
        if i.unread:
            a = []
            a.append(i)
            t = i.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            a.append(t)
            a.append(i.unread)
            a.append(i.id)
            a.append(i.description)
            notes.append(a)
    for i in user.notifications.all():
        if not i.unread:
            a = []
            a.append(i)
            t = i.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            a.append(t)
            a.append(i.unread)
            a.append(i.id)
            a.append(i.description)
            notes.append(a)
    page = Paginator(notes, 10)
    notes = page.get_page(current_page)
    content = {
        'notes': notes,
        'current_page': current_page,
        'max_page': page.num_pages,
        'username': user.username
    }

    return render(request, 'main/message.html', content)


def read_message(request):
    user = request.user
    mid = int(request.GET.get('id', 0))
    f = 0
    if mid == 0:
        f = 1
        mid = int(request.GET.get('f', 0))
    m = user.notifications.get(id=mid)
    m.unread = False
    m.save()
    if f:
        return redirect('supervisor_approve.html')
    return redirect('message.html')


def GetAddress(request):
    print(2222222222222)
    if request.method == "POST":
        lat = request.POST.get('lat')
        lag = request.POST.get('lag')
        print(11111111111111111111111111111)
        print(lat)
        print(lag)
        return HttpResponse(str(lat))
    return render(request, 'temp_regist.html')

def schedule_summary(request):
    e_id = int(request.GET.get('e_id', 0))
    user = User.objects.get(e_id=e_id)
    attens = Attendance.objects.filter(emp=user)
    year = 2020
    month = 6
    cal = calendar.monthcalendar(year, month)
    a, Id = get_calendar(e_id, year, month)
    cal3 = a['ret']
    N = 4

    for atten in attens:
        c_y, c_m, c_d = str(atten.clock_in)[:10].split('-')
        c_y, c_m, c_d = int(c_y), int(c_m), int(c_d)
        if c_y == year and c_m == month:
            clock_in_time = str(atten.clock_in)[11:19]
            ring_out_date = str(atten.ring_out)[:10]
            ring_out_time = str(atten.ring_out)[11:19]

            print(ring_out_time, clock_in_time)
            for i in range(len(cal)):
                for j in range(len(cal[0])):
                    if c_d == cal[i][j]:
                        if atten.ring_out is None:
                            cal[i][j] = [clock_in_time[:5], '']

                            time1 = str(atten.clock_in)[11:19]
                            time2 = str(cal3[i][j][0])

                            if cal3[i][j][0] == -1:
                                cal[i][j] = [-2] * N
                                continue

                            time1 = time.strptime(time1, "%H:%M:%S") # 实际时间
                            time2 = time.strptime(time2, "%H:%M:%S") # 排版时间
                            
                            if time1 > time2:
                                cal[i][j].append(1)
                            else:
                                cal[i][j].append(0)

                            cal[i][j].append(0)

                        else:
                            cal[i][j] = [clock_in_time[:5], ring_out_time[:5]]
                            
                            time1 = str(atten.clock_in)[11:19]
                            time2 = str(cal3[i][j][0])

                            if cal3[i][j][0] == -1:
                                cal[i][j] = [-2] * N
                                continue

                            time1 = time.strptime(time1, "%H:%M:%S") # 实际时间
                            time2 = time.strptime(time2, "%H:%M:%S") # 排版时间
                            
                            if time1 < time2:
                                cal[i][j].append(1)
                            else:
                                cal[i][j].append(0)

                            time1 = str(ring_out_time)
                            time2 = str(cal3[i][j][1])

                            if cal3[i][j][0] == -1:
                                cal[i][j] = [-2] * N
                                continue

                            time1 = time.strptime(time1, "%H:%M:%S") # 实际时间
                            time2 = time.strptime(time2, "%H:%M:%S") # 排版时间
                            
                            if time1 < time2:
                                cal[i][j].append(1)
                            else:
                                cal[i][j].append(0)

                        continue
    

    for i in range(len(cal)):
        for j in range(len(cal[0])):
            if isinstance(cal[i][j], int):
                cal[i][j] = [-1] * N
            if a['ret'][i][j] == (-1, -1):
                cal[i][j] = [-2] * N
            if a['cal2'][i][j] == 0:
                cal[i][j] = [-3] * N
            

    content = {
        'cal2': calendar.monthcalendar(year, month),
        'ret': cal,
        'username': user.username,
        'e_id': e_id,
    }

    return render(request, 'attendance_summary_%d.html' % Id, content)
