import argparse
import json
import shutil

parser = argparse.ArgumentParser()
parser.add_argument("name", help="name of sketch")
parser.add_argument("type", help="type of sketch", choices=["d3", "p5"])
args = parser.parse_args()

with open('./sketch-index.json', 'r') as index_file:
    index = json.load(index_file)
assert args.name not in index

index[args.name] = {
    'id': args.name,
    'type': args.type,
    'title': args.name.capitalize(),
    'description': [],
    "gui": []
}

print('creating new sketch:')
print(json.dumps(index[args.name], indent=4))

while True:
    proceed = input('continue? y/n: ')
    if proceed.lower() == 'y':
        with open('./sketch-index.json', 'w') as index_write:
            index_write.write(json.dumps(index, indent=4))

        if args.type == 'd3':
            shutil.copy('./editor/components/templated3.js', f'./editor/sketchfiles/{args.name}.js')
        elif args.type == 'p5':
            shutil.copy('./editor/components/templatep5.js', f'./editor/sketchfiles/{args.name}.js')
        break
    elif proceed.lower() == 'n':
        break
    else:
        print('please input y or n')