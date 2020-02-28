# script to move single js files from editor to interactive
# only moves sketches that have an entry in sketch-index.json

import os
import shutil
import json

print('=' * 10 + 'pre-commit.py' + '=' * 10)
print('loading sketches and thumbnails')

sketch_files = {}
for filename in os.listdir('./editor/sketchfiles'):
    sketch_files[filename[:-3]] = os.path.abspath(os.path.join('./editor/sketchfiles', filename))

thumbnails = {}
for filename in os.listdir('./thumbs'):
    thumbnails[filename[:-4]] = os.path.abspath(os.path.join('./thumbs', filename))

print(f'got {len(list(sketch_files))} sketches and {len(list(thumbnails))} thumbnails')

with open('./sketch-index.json', 'r') as index_file:
    index = json.loads(index_file.read())

print(f'got {len(list(index))} sketches in index:')

for sketch_name in list(index):
    print(f' {sketch_name}')
    sketch_folder_path = os.path.abspath(f'./interactive/{sketch_name}')
    if not os.path.isdir(sketch_folder_path):
        print(f'making new folder for sketch {sketch_name}')
        os.mkdir(sketch_folder_path)
    if sketch_name in sketch_files and sketch_name in thumbnails:
        current_sketch = os.path.join(sketch_folder_path, f'{sketch_name}.js')
        current_thumb = os.path.join(sketch_folder_path, 'thumb.png')
        if os.path.exists(current_sketch):
            os.remove(current_thumb)
        if os.path.exists(current_thumb):
            os.remove(current_thumb)

        shutil.copy(sketch_files[sketch_name], current_sketch)
        shutil.copy(thumbnails[sketch_name], current_thumb)
    else:
        print(f'incomplete sketch: missing files for {sketch_name}')
        shutil.rmtree(sketch_folder_path)
