# Generated by Django 4.2.4 on 2025-03-15 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(),
        ),
    ]
