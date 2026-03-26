import json

def load_file(filename):
    with open(filename , 'r') as f:
        return json.load(f)

def display_quiz(data):
    i = 1
    print("question: ")
    for question in data['questions']:
        print(i , question['question'])
        print()
        print('A.' , question['options'][0])
        print('B.' , question['options'][1])
        print('C.' , question['options'][2])
        print('D.' , question['options'][3])
        print()

        print('Answer = ' , question['answer'])
        print()

        i = i+1


data = load_file('ir.json')
# print(data)
cf = display_quiz(data)
print(cf)




