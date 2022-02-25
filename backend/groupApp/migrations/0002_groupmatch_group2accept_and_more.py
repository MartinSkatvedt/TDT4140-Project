# Generated by Django 4.0.2 on 2022-02-22 10:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("groupApp", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="groupmatch",
            name="group2Accept",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="interestgroup",
            name="description",
            field=models.TextField(default="", max_length=500),
        ),
        migrations.AlterField(
            model_name="interestgroup",
            name="groupAdmin",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="admin",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]