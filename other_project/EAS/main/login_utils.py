import requests
from django.contrib import auth
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from pprint import pprint
from .models import *
import datetime
import json
from notifications.signals import notify
import time
from .utils import check_scheEmp_isRight

root = User.objects.get(username='root')


def geocode(location):
    parameters = {
        'output': 'json',
        'key': '60f56b1549bef5a997ef2e708bf342e6',
        'location': location,
        'radius': 1000,
        'extensions': 'all',
    }
    base = 'http://restapi.amap.com/v3/geocode/regeo'
    response = requests.get(base, parameters)
    return response.json()


def regist(request):
    if request.method == 'GET':
        s = '87.58091999999999, 43.8650155'
        data = geocode(s)
        addr = data['regeocode']['formatted_address']
        # print(addr)

        return render(request, 'temp_regist.html')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            User.objects.create_user(username=username, password=password)
        except:
            return render(request, 'temp_regist.html', {'error': '该用户已存在'})
        return render(request, 'temp_login.html')


def login(request):
    if request.method == 'GET':
        return render(request, 'temp_login.html')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        urls = ['manager_home.html', 'supervisor_home.html', 'emp_home.html']
        user = auth.authenticate(username=username, password=password)

        if user:
            auth.login(request, user)
            url = urls[user.position]

            threshold = 1800  # 30分钟
            threshold2 = 1800  # 30分钟

            if user.e_sche != None:
                # now = int(time.mktime(time.strptime("2020-06-12 07:59:00", "%Y-%m-%d %H:%M:%S")))
                now = time.time()

                temp = str(datetime.datetime.now())[
                    :11] + str(user.e_sche.work_begin)
                theory_clock_ts = int(time.mktime(
                    time.strptime(temp, "%Y-%m-%d %H:%M:%S")))

                delta = theory_clock_ts - now
                if delta > 0 and delta < threshold and user.is_notify:
                    notify.send(
                        root,
                        recipient=user,
                        verb='提醒您上班',
                        description='read_message?id=%d' % user.e_id,
                    )

                # now = int(time.mktime(time.strptime("2020-06-12 17:40:00", "%Y-%m-%d %H:%M:%S")))
                temp = str(datetime.datetime.now())[
                    :11] + str(user.e_sche.work_end)
                theory_ring_ts = int(time.mktime(
                    time.strptime(temp, "%Y-%m-%d %H:%M:%S")))

                delta2 = now - theory_ring_ts
                if delta2 > threshold2 and user.is_notify:
                    notify.send(
                        root,
                        recipient=user,
                        verb='提醒您已下班 %d 分钟，如有需要请申请加班' % (threshold2 // 60),
                        description='read_message?id=%d' % user.e_id,
                    )

            notis = user.notifications.all()
            have_notifications = 0
            if len(notis) > 0:
                have_notifications = 1

            check_scheEmp_isRight(user.e_id)
            if user.position == 2:
                position = '员工'
            elif user.position == 1:
                position = '部门主管'
            else:
                position = '经理'

            content = {
                'username': user.username,
                'emp_id': user.e_id,
                'position': position,
                'depart': user.depart,
                'have_notifications': have_notifications,
            }
            print(content)
            renderobj = render(request, 'main/' + url, content)
            renderobj.set_cookie("eid", str(user.e_id), path='/')
            renderobj.set_cookie("depart", user.depart, path='/')
            y, m, d = str(datetime.datetime.now())[:10].split('-')
            renderobj.set_cookie("y", y, path='/')
            renderobj.set_cookie("m", m, path='/')
            renderobj.set_cookie("d", d, path='/')

            return renderobj

        else:
            return render(request, 'temp_login.html', {'error': '用户名或密码错误'})


def logout(request):
    if request.method == 'POST' and request.is_ajax():
        auth.logout(request)
        JsonBackInfo = {
            'ret': 1,
        }
        return JsonResponse(JsonBackInfo)


def index(request):
    return HttpResponseRedirect('/login')
