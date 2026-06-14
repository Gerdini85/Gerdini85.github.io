import sys
imie = "Gerard"
album = "57701"

wersja = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
lokalizacja = sys.executable

print(f" Hello {imie} ({album}).\n This environment is using Python version {wersja} at location {lokalizacja}.\n")