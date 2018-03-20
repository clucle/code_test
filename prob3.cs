using System;
using System.Linq;

namespace ConsoleApp1
{
    internal static class Program
    {
        private const string StartTable = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
        private const string MiddleTable = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
        private const string EndTable = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

        private static void Main()
        {
            var input = Console.ReadLine();
            if (input == null) return;

            var charArray = new[] {'!', '!', '!', '!', '!', '!'};
            var cnt = 0;

            var startCh = '!';
            var middleCh = '!';
            var endCh = '!';

            foreach (var ch in input)
            {
                if (ch == ' ') continue;

                if (cnt == 6)
                {
                    ErrHandler("한 글자를 넘어선 글자 수");
                }

                

                if (!IsHangul(ch))
                {
                    ErrHandler("한글만 입력해주세요");
                    return;
                }

                charArray[cnt] = ch;
                cnt++;
            }

            var mid = 0;
            for (var i = charArray.Length - 1; i > -1; i--)
            {
                if (MiddleTable.IndexOf(charArray[i]) > -1)
                {
                    mid = i;
                    break;
                }
            }

            if (mid == 0 || mid > 3)
            {
                ErrHandler("모음이 글자를 만들 수 없는 자리에 있음");
                return;
            }


            if (mid == 1)
            {
                if (charArray[4] != '!')
                {
                    ErrHandler("글자수 에러");
                    return;
                }

                if (StartTable.IndexOf(charArray[0]) > -1)
                {
                    startCh = charArray[0];
                    middleCh = charArray[1];
                    endCh = SumEnd(charArray[2], charArray[3]);
                }
                else
                {
                    ErrHandler("시작에 자음이 없음");
                    return;
                }
            }
            else if (mid == 2)
            {
                if (charArray[5] != '!')
                {
                    ErrHandler("글자수 에러");
                    return;
                }

                if (MiddleTable.IndexOf(charArray[1]) > -1)
                {
                    // 모음 두개 합치기
                    startCh = charArray[0];
                    middleCh = SumMiddle(charArray[1], charArray[2]);
                    endCh = SumEnd(charArray[3], charArray[4]);
                }
                else if (StartTable.IndexOf(charArray[1]) > -1)
                {
                    // 자음 두개 합치기
                    startCh = SumStart(charArray[0], charArray[1]);
                    middleCh = charArray[2];
                    endCh = SumEnd(charArray[3], charArray[4]);
                }
            }
            else if (mid == 3)
            {
                startCh = SumStart(charArray[0], charArray[1]);
                middleCh = SumMiddle(charArray[2], charArray[3]);
                endCh = SumEnd(charArray[4], charArray[5]);
            }

            if (!IsHangul(startCh) || !IsHangul(middleCh) || !IsHangul(endCh))
            {
                ErrHandler("한글이 완성 안됨");
                return;
            }
            /*
            Console.WriteLine("초성 : " + startCh);
            Console.WriteLine("중성 : " + middleCh);
            Console.WriteLine("종성 : " + endCh);
            */
            Console.WriteLine("오토마타 : " + Automata(startCh, middleCh, endCh));
        }


        private static char Automata(char start, char middle, char end)
        {
            var iStart = StartTable.IndexOf(start);
            var iMiddle = MiddleTable.IndexOf(middle);
            var iEnd = EndTable.IndexOf(end);
            
            var x = (iStart * 21 * 28) + (iMiddle * 28) + iEnd;
            return (char) (x + 0xAC00);
        }

        private static char SumStart(char first, char second)
        {
            if (StartTable.IndexOf(first) == -1 || StartTable.IndexOf(second) == -1 || first != second) return '!';

            switch (first)
            {
                case 'ㄱ':
                    return 'ㄲ';
                case 'ㄷ':
                    return 'ㄸ';
                case 'ㅂ':
                    return 'ㅃ';
                case 'ㅅ':
                    return 'ㅆ';
                case 'ㅈ':
                    return 'ㅉ';
                default:
                    return '!';
            }
        }

        private static char SumMiddle(char first, char second)
        {
            if (MiddleTable.IndexOf(first) == -1 || MiddleTable.IndexOf(second) == -1) return '!';
            if (second == 'ㅣ')
            {
                switch (first)
                {
                    case 'ㅏ':
                        return 'ㅐ';
                    case 'ㅑ':
                        return 'ㅒ';
                    case 'ㅓ':
                        return 'ㅔ';
                    case 'ㅕ':
                        return 'ㅖ';
                    case 'ㅗ':
                        return 'ㅚ';
                    case 'ㅜ':
                        return 'ㅟ';
                    case 'ㅡ':
                        return 'ㅣ';
                    default:
                        return '!';
                }
            }

            switch (first)
            {
                case 'ㅗ':
                    switch (second)
                    {
                        case 'ㅏ':
                            return 'ㅘ';
                        case 'ㅐ':
                            return 'ㅙ';
                        default:
                            return '!';
                    }
                case 'ㅜ':
                    switch (second)
                    {
                        case 'ㅓ':
                            return 'ㅝ';
                        case 'ㅔ':
                            return 'ㅞ';
                        default:
                            return '!';
                    }
                default:
                    return '!';
            }
        }


        private static char SumEnd(char first, char second)
        {
            if (first == '!') return ' ';
            if (second == '!') return first;
            if (EndTable.IndexOf(first) == -1 || EndTable.IndexOf(second) == -1) return '!';

            switch (first)
            {
                case 'ㄱ':
                    switch (second)
                    {
                        case 'ㄱ':
                            return 'ㄲ';
                        case 'ㅅ':
                            return 'ㄳ';
                        default:
                            return '!';
                    }
                case 'ㄴ':
                    switch (second)
                    {
                        case 'ㅈ':
                            return 'ㄵ';
                        case 'ㅎ':
                            return 'ㄶ';
                        default:
                            return '!';
                    }
                case 'ㄹ':
                    switch (second)
                    {
                        case 'ㄱ':
                            return 'ㄺ';
                        case 'ㅁ':
                            return 'ㄻ';
                        case 'ㅂ':
                            return 'ㄼ';
                        case 'ㅅ':
                            return 'ㄽ';
                        case 'ㅌ':
                            return 'ㄾ';
                        case 'ㅍ':
                            return 'ㄿ';
                        case 'ㅎ':
                            return 'ㅀ';
                        default:
                            return '!';
                    }
                case 'ㅂ':
                    switch (second)
                    {
                        case 'ㅅ':
                            return 'ㅄ';
                        default:
                            return '!';
                    }
                case 'ㅅ':
                    switch (second)
                    {
                        case 'ㅅ':
                            return 'ㅆ';
                        default:
                            return '!';
                    }
                default:
                    return '!';
            }
        }

        private static bool IsHangul(char dat)
        {
            return StartTable.IndexOf(dat) > -1 || MiddleTable.IndexOf(dat) > -1 || EndTable.IndexOf(dat) > -1;
        }

        private static void ErrHandler(string err)
        {
            Console.WriteLine(err);
        }
    }
}