# script to move single js files from editor to interactive
# only moves sketches that have an entry in sketch-index.json

import os
import shutil
import json

print('=' * 10 + 'pre-commit.py' + '=' * 10)
print('loading sketches and thumbnails')

print('double check import statements before pushing!')

# iterate through entries in sketch index
# check if a folder exists, create
# check if a js file exists in editor, copy
# check if a thumbnail exists in thumbs, copy
# go through files in interactive and check that they all have a thumb
# remove any that don't

index = json.load(open('./sketch-index.json'))
editor_sketchfiles = './editor/sketchfiles'
thumbs = './thumbs'

for sketch_id in index:
    print(sketch_id)
    sketch_folder = f'./interactive/{sketch_id}'
    sketch_file = f'{editor_sketchfiles}/{sketch_id}.js'
    thumb_file = f'{thumbs}/{sketch_id}.png'

    if not os.path.isdir(sketch_folder):
        print(f'creating interactive/{sketch_folder}')
        os.mkdir(sketch_folder)
    if os.path.exists(sketch_file):
        shutil.copy(sketch_file, f'{sketch_folder}/{sketch_id}.js')
    if os.path.exists(thumb_file):
        shutil.copy(thumb_file, f'{sketch_folder}/thumb.png')

for sketch_id in os.listdir('./interactive'):
    files = os.listdir(f'./interactive/{sketch_id}')
    if not f'{sketch_id}.js' in files:
        print(f'removing {sketch_id}, no js')
        shutil.rmtree(f'./interactive/{sketch_id}')
    if not f'thumb.png' in files:
        print(f'removing {sketch_id}, no thumbnail')
        shutil.rmtree(f'./interactive/{sketch_id}')