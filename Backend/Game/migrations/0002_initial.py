# Generated by Django 5.0.3 on 2024-03-30 16:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Game', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='acheivement',
            name='users',
            field=models.ManyToManyField(related_name='acheivements', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('item_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='Game.item')),
                ('color', models.CharField(default='#FF0000', max_length=7)),
            ],
            bases=('Game.item',),
        ),
        migrations.CreateModel(
            name='Board',
            fields=[
                ('item_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='Game.item')),
                ('name', models.CharField(max_length=50)),
            ],
            bases=('Game.item',),
        ),
        migrations.CreateModel(
            name='Padel',
            fields=[
                ('item_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='Game.item')),
                ('name', models.CharField(max_length=50)),
                ('definition', models.TextField()),
            ],
            bases=('Game.item',),
        ),
        migrations.AddField(
            model_name='items',
            name='current_item',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='in_use', to='Game.item'),
        ),
        migrations.AddField(
            model_name='items',
            name='owned_items',
            field=models.ManyToManyField(related_name='owned_by', to='Game.item'),
        ),
        migrations.AddField(
            model_name='items',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='match',
            name='enemy',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='match',
            name='enemy_match',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='Game.match'),
        ),
        migrations.AddField(
            model_name='match',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='matches', to=settings.AUTH_USER_MODEL),
        ),
    ]
