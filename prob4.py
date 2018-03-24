dict_hangul = {}
cnt_dict_init_call = {}
g_init_word = ""


def find_word(_word):

    init_word = _word[-1:]

    if init_word not in dict_hangul.keys():
        print("not in my dictionary")
        return -1

    if len(dict_hangul[init_word]) == cnt_dict_init_call[init_word]:
        print("not enough word")
        return -1

    cnt_dict_init_call[init_word] += 1

    ret = dict_hangul[init_word][cnt_dict_init_call[init_word] - 1]

    if ret == g_init_word:
        return find_word(ret)
    else:
        return dict_hangul[init_word][cnt_dict_init_call[init_word] - 1]

print("단어 사전 초기화 중..")

path = './word.txt'
with open(path, 'r', encoding='utf-16') as f:
    while True:
        words = f.readlines()
        if not words:
            break

        for raw_word in words:
            word = raw_word[:-1]
            init = raw_word[:1]
            end = raw_word[-2:-1]

            if len(word) == 1 \
                    or end == '다'\
                    or ' ' in word \
                    or '(' in word \
                    or ')' in word \
                    or '/' in word:
                continue

            if init not in dict_hangul.keys():
                dict_hangul[init] = []

            dict_hangul[init].append(word)

for k in dict_hangul.keys():
    cnt_dict_init_call[k] = 0

print("처음 시작할 단어 입력 :")
g_init_word = input()
word = g_init_word

while True:
    next_word = find_word(word)
    if next_word == -1:
        break
    else:
        print(next_word)
        word = next_word

