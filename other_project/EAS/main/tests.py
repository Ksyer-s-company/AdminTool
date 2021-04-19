from django.test import TestCase
from .views import *
from django.http import HttpRequest
from django.shortcuts import render, redirect
from django.template.loader import render_to_string


class EmpManageTest(TestCase):

    def test_emp_manage_template(self):
        msgs = [
            ['1', '1', '1', '1', '1']
        ]
        msgs.extend([
            ['2', 'qw', 'er', '3', '4']
        ] * 9)
        html = render_to_string('main/emp_manage.html', {'msgs': msgs})
        self.assertIn('qw', html)


class MyaccountTest(TestCase):
    def test_myaccount_template(self):
        msg = [
            'qw', '123@qq.com', '1', 'qwe', '12345678911'
        ]

        html = render_to_string('main/my_account.html', {'msg': msg})
        self.assertIn('qw', html)

    def test_account_edit_template(self):
        msg = [
            'qw', '123@qq.com', '1', 'qwe', '12345678911'
        ]

        html = render_to_string('main/account_edit.html', {'msg': msg})
        self.assertIn('qw', html)


class CancelLeaveTest(TestCase):

    def test_cancel_leave_template(self):
        not_cancel_leaves = [
            ['2020-06-09 13:00', '2020-06-09 15:00', '事假', '未通过']
        ]
        lastfive = [
            ['sw', '2020-06-08 13:01', '事假', '未通过']
        ]
        content = {
            'not_cancel_leaves': not_cancel_leaves,
            'lastfive': lastfive
        }
        html = render_to_string('main/cancel_leave_manage.html', content)
        self.assertIn('sw', html)


class SupervisorApproveTest(TestCase):

    def test_sup_approve_template(self):
        msgs = [
            ['qw', '123', '2020-06-09 13:00']
        ]
        html = render_to_string(
            'main/supervisor_approve.html', {'msgs': msgs})
        self.assertIn('qw', html)


class Att_Sum_SupTest(TestCase):
    # 主管进入的attendance_summary_supervisor
    def test_attsumsup_template(self):
        msgs = [
            ['74', 'qw', 'saf', '30', '30', '0', '0', '30']
        ]
        html = render_to_string(
            'main/attendance_summary_supervisor.html', {'msgs': msgs})
        self.assertIn('saf', html)


class ScheManageTest(TestCase):

    def test_schemanage_template(self):
        msgs = [
            ['74', 'qw', 'saf', '三班', '10:00-18:00', '0']
        ]
        html = render_to_string(
            'main/schedule_manage.html', {'msgs': msgs})
        self.assertIn('saf', html)

    def test_scheedit_1_template(self):
        msg = ['74', 'qw']
        sches = [
            ['ter', '45'], ['dfgdf', '44']
        ]
        content = {
            'msg': msg,
            'sches': sches
        }
        html = render_to_string(
            'main/schedule_edit_1.html', content)
        self.assertIn('qw', html)


class Att_SumTest(TestCase):
    # 经理进入的attendance_summary
    def test_attsum_template(self):
        msgs = [
            ['74', 'qw', 'saf', '30', '30', '0', '0', '30']
        ]
        html = render_to_string(
            'main/attendance_summary.html', {'msgs': msgs})
        self.assertIn('saf', html)


'''
    #未模板化
class Sche_SumTest(TestCase): 
    def test_schesum_1_template(self):
        msgs = [
            ['74', 'qw', 'saf', '三班']
        ]
        html = render_to_string(
            'main/schedule_summary_1', {'msgs': msgs})
        self.assertIn('saf', html)
'''

'''
class MyScheduleTest(TestCase):
    def test_my_schedule_1_template(self):
        request = HttpRequest()
        x = my_schedule_1(request)
        self.assertIn('31', x.content.decode())
'''
