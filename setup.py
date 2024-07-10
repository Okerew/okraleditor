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
os.system("git clone https://github.com/Okerew/ace-builds.git ace")
os.system("yarn add electron-builder --dev")
os.system("yarn build")
