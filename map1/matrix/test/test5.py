import json
dic = { 'str': 'this is a string',
        'list': [1, 2, 'a', 'b'],
        'sub_dic': {
            'sub_str': 'this is sub str',
            'sub_list': [1, 2, 3]
        },
        'end': 'end' }
dict_json=json.dumps(dic) #output: #'{"sub_dic": {"sub_str": "this is sub str", "sub_list": [1, 2, 3]}, "end": "end", "list": [1, 2, "a", "b"], "str": "this is a string"}'
print  dict_json


_list=[1,2,3]
_json=json.dumps(_list)
print _json

