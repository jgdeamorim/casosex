import pkgutil
try:
    import mcp
    print("mcp modules:")
    for importer, modname, ispkg in pkgutil.walk_packages(mcp.__path__, mcp.__name__ + '.'):
        print(modname)
except Exception as e:
    print(e)
