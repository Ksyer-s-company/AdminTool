# Generated by Django 2.2.3 on 2020-06-10 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20200610_1709'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='e_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
