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
os.system("git clone https://github.com/ajaxorg/ace-builds.git ace")
os.system("yarn add electron-builder --dev")
os.system("yarn build")
os.system("cd")
os.system("cd Documents")
os.system("mkdir OCE")
os.system("cd OCE")
os.system("mkdir temps config extensions")
