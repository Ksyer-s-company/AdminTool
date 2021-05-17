from peewee import *

database = MySQLDatabase('AdminTools', **{'charset': 'utf8', 'use_unicode': True, 'host': '39.105.6.82', 'user': 'root', 'password': 'Chiningmeng1'})

class UnknownField(object):
    def __init__(self, *_, **__): pass

class BaseModel(Model):
    class Meta:
        database = database

class Beijinghua(BaseModel):
    beijinghua_id = AutoField()
    generate_time = DateTimeField(null=True)
    input_str = CharField(null=True)

    class Meta:
        table_name = 'Beijinghua'

class CodeTool(BaseModel):
    code = CharField(null=True)
    code_id = AutoField()
    generate_time = DateTimeField(null=True)

    class Meta:
        table_name = 'CodeTool'

class FileTool(BaseModel):
    file_id = AutoField()
    file_path = CharField(null=True)
    generate_time = DateTimeField(null=True)

    class Meta:
        table_name = 'FileTool'

class ImageTool(BaseModel):
    generate_time = DateTimeField(null=True)
    img_base64 = TextField(null=True)
    img_filename = CharField(null=True)
    img_id = AutoField()

    class Meta:
        table_name = 'ImageTool'

class MarkdownTool(BaseModel):
    generate_time = DateTimeField(null=True)
    markdown_id = AutoField()
    markdown_text = CharField(null=True)

    class Meta:
        table_name = 'MarkdownTool'

class Repeater(BaseModel):
    emoji = CharField(null=True)
    generate_time = DateTimeField(null=True)
    input_str = CharField(null=True)
    repeater_id = AutoField()

    class Meta:
        table_name = 'Repeater'

