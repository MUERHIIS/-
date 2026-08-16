import bpy, os, shutil

src = r"D:\桌面\blender st\矢量突破\仿矢量突破04.blend"
bak = r"D:\桌面\blender st\矢量突破\仿矢量突破04_backup2.blend"
if not os.path.exists(bak):
    shutil.copy2(src, bak)
    print("BACKUP_CREATED", bak)
else:
    print("BACKUP_EXISTS", bak)

bpy.ops.wm.open_mainfile(filepath=src)
curve = bpy.data.objects["NURBS路径"]
ng = curve.modifiers[0].node_group
nodes = {n.name: n for n in ng.nodes}
gin = nodes["组输入"]
math2 = nodes["运算.002"]
comb = nodes["合并 XYZ"]

# 1. collect links to remove first, then remove them
to_remove = []
for l in list(ng.links):
    try:
        if l.to_node == math2 and l.to_socket.name == "Value" and not l.is_valid:
            to_remove.append(l)
        elif l.from_node == math2 and l.to_node == comb:
            to_remove.append(l)
    except Exception:
        pass
for l in to_remove:
    ng.links.remove(l)

# 2. connect the correct 位移长度 output (VALUE) to 运算.002 second input
out_socket = None
for o in gin.outputs:
    if o.name == "位移长度" and o.type == 'VALUE':
        out_socket = o
        break
if out_socket is None:
    raise RuntimeError("位移长度 output socket not found on 组输入")
ng.links.new(out_socket, math2.inputs[1])

# 3. direction: X instead of Y
ng.links.new(math2.outputs[0], comb.inputs["X"])

bad = [l for l in ng.links if not l.is_valid]
print("INVALID_LINKS_LEFT", len(bad))

# ============ VERIFY ============
item = None
for it in ng.interface.items_tree:
    if it.name == "位移长度" and it.item_type == 'SOCKET':
        item = it
        break
print("ITEM_FOUND", item is not None)

def get_inst():
    dg = bpy.context.evaluated_depsgraph_get()
    out = {}
    for it2 in dg.object_instances:
        try:
            if it2.parent and it2.parent.original == curve:
                t = it2.matrix_world.translation
                out[it2.object.name] = (round(t.x, 4), round(t.y, 4), round(t.z, 4))
        except Exception:
            pass
    return out

bpy.context.scene.frame_set(1)
def set_len(v):
    if item is not None:
        item.default_value = v

set_len(0.5)
a = get_inst()
set_len(1.5)
b = get_inst()
set_len(0.5)
print("LEN0.5", dict(sorted(a.items())))
print("LEN1.5", dict(sorted(b.items())))
diff = {k: round(b[k][0] - a[k][0], 3) for k in a if abs(b[k][0] - a[k][0]) > 0.001}
print("X_DIFF_0.5_TO_1.5", diff)
ok = len(diff) > 0
print("OK", ok)
if ok:
    bpy.ops.wm.save_mainfile(filepath=src)
    print("SAVED")
else:
    print("NOT_SAVED")
print("DONE")
