import bpy, os, shutil

src = r"D:\桌面\blender st\矢量突破\仿矢量突破04.blend"
bak = r"D:\桌面\blender st\矢量突破\仿矢量突破04_backup2.blend"
if not os.path.exists(bak):
    shutil.copy2(src, bak)
    print("BACKUP_CREATED", bak)

bpy.ops.wm.open_mainfile(filepath=src)
curve = bpy.data.objects["NURBS路径"]
mod = curve.modifiers[0]
ng = mod.node_group
nodes = {n.name: n for n in ng.nodes}
gin = nodes["组输入"]
math2 = nodes["运算.002"]
comb = nodes["合并 XYZ"]

# 1. remove invalid links and the old Y-direction link
to_remove = []
for l in list(ng.links):
    try:
        if not l.is_valid:
            to_remove.append(l)
        elif l.from_node == math2 and l.to_node == comb:
            to_remove.append(l)
    except Exception:
        pass
for l in to_remove:
    ng.links.remove(l)

# 2. connect the correct 位移长度 output -> 运算.002 second input
out_socket = None
for o in gin.outputs:
    if o.name == "位移长度" and o.type == 'VALUE':
        out_socket = o
        break
if out_socket is None:
    raise RuntimeError("位移长度 output socket not found")
ng.links.new(out_socket, math2.inputs[1])

# 3. direction: X instead of Y
ng.links.new(math2.outputs[0], comb.inputs["X"])

# 4. modifier stored value = 0.5
mod["Socket_2"] = 0.5

bad = [l for l in ng.links if not l.is_valid]
print("INVALID_LINKS_LEFT", len(bad))

# ============ VERIFY ============
def get_inst():
    dg = bpy.context.evaluated_depsgraph_get()
    out = {}
    for it in dg.object_instances:
        try:
            if it.parent and it.parent.original == curve:
                t = it.matrix_world.translation
                out[it.object.name] = (round(t.x, 4), round(t.y, 4), round(t.z, 4))
        except Exception:
            pass
    return out

bpy.context.scene.frame_set(1)
mod["Socket_2"] = 0.5
a = get_inst()
mod["Socket_2"] = 1.5
b = get_inst()
mod["Socket_2"] = 0.5

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
