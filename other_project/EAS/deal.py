import os
import re

folder_names = ['resources', 'plugins', 'images', 'files', 'data']
def deal_1():
    path = 'main/templates/main_1/'
    for _, _, names in os.walk(path):
        for name in names:
            print(name)
            with open(path + name, 'r+', encoding='utf-8-sig') as f:
                lines = []
                flag = 0
                for line in f.readlines():
                    for folder_name in folder_names:
                        str = 'src="' + folder_name
                        if str in line:
                            line = line.replace(str, 'src="static/' + folder_name)
                        str = 'href="' + folder_name
                        if str in line:
                            line = line.replace(str, 'href="static/' + folder_name)
                    
                    if 'return pageName + ".html"' in line:
                        flag = 1
                    if flag:
                        if 'return pageName + ".html"' in line:
                            line = line.replace("return pageName", 'return "templates/main/" + pageName')
                        if 'return (url ? url : ' in line:
                            line = line.replace('return (url ? url : "about:blank")', 'return (url ? "templates/main/" + url : "about:blank")')

                    lines.append(line)
            with open('main/templates/main/' + name, 'w', encoding='utf-8') as f:
                f.writelines(lines)

def number_selecter(re_str, line, prefix_length):
    idx_str = re.compile(re_str).findall(line)
    if len(idx_str) != 0:
        idx_str = idx_str[0]
        idx_str = str(idx_str)
        idx_int = int(idx_str[prefix_length:])
        line = line.replace(idx_str, 'u' + str(idx_int - 105))
    return line


def deal_2():
    path = 'main/templates/main/'
    for _, _, names in os.walk(path):
        for name in names:
            if name == 'emp_manage.html':
                print(name)
                with open(path + name, 'r+', encoding='utf-8-sig') as f:
                    lines = []
                    for line in f.readlines():
                        #line = number_selecter('u\d+', line, 1)
                        line = number_selecter('add ?: ?\d+', line, 4)
                        lines.append(line)
                with open('main/templates/' + name, 'w', encoding='utf-8') as f:
                    f.writelines(lines)

deal_1()
# https://www.cnblogs.com/allen2333/p/11754161.html