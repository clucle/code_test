
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 가장 큰 숫자가 10^1024 라고 가정
#define MAX_NUM_SIZE 1024

void factorial(int input, char* ret);
void addNumAtCharArrayWithDigit(int num, char* des, int digit);
void addIntChar(int num, char* c);

int charToInt(char c);
char intToChar(int i);

int
main() {
    int input;
    scanf("%d", &input);

    char* ret = (char *)malloc(sizeof(char) * MAX_NUM_SIZE);

    factorial(input, ret);

    int len;
    printf("%d! = ", input);

    for (len = strlen(ret); len >= 0; len--) {
        printf("%c", ret[len]);
    }
    printf("\n");


    free(ret);
    return 0;
}

void
factorial(int input, char* ret) {
    register int cur_num;
    register int location;

    char* tmp;

    int add_num;
    int len;
    char* prev = (char *)malloc(sizeof(char) * MAX_NUM_SIZE);

    char* origin = ret;
    char* not_origin = prev;

    prev[0] = '1';
    prev[1] = '\0';

    for (cur_num = 1; cur_num <= input; cur_num++) {

        ret[0] = '\0';

        len = strlen(prev);
        for (location = 0; location < len; location++) {
            add_num = cur_num * charToInt(prev[location]);
            addNumAtCharArrayWithDigit(add_num, ret, location);
        }

        tmp = ret;
        ret = prev;
        prev = tmp;

    }

    memcpy(origin, prev, strlen(prev)+1);
    free(not_origin);
}


void
addNumAtCharArrayWithDigit(int num, char* des, int digit) {
    int rest;

    if (num == 0) {
        addIntChar(0, des + digit);
    }

    while (num != 0) {
        rest = num % 10;
        num /= 10;

        addIntChar(rest, des + digit);
        digit++;
    }
}

void
addIntChar(int num, char* c) {

    if (c[0] == '\0') {
        c[0] = intToChar(num);
        c[1] = '\0';
        return ;
    }

    int add = num + charToInt(c[0]);

    if (add > 9) {
        c[0] = intToChar(add - 10);
        addIntChar(1, (c + 1));
    } else {
        c[0] = intToChar(add);
    }
}

int
charToInt(char c) {
    return (c - 48);
}

char
intToChar(int i) {
    return i + 48;
}
