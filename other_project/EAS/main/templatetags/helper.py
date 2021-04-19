from django import template

register = template.Library()

@register.filter
def mul(value, a):
    return (value * a)
