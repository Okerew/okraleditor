import os
import platform
os.system("npm install")
def os_function():
    current_platform = platform.system()
    if current_platform == "Windows":
        os.system("npm install --global yarn")
    else:
        os.system("sudo npm install --global yarn")


os_function()
os.system("git clone https://github.com/ajaxorg/ace-builds.git libs/ace-builds-1.5.0")
os.system("yarn build")
