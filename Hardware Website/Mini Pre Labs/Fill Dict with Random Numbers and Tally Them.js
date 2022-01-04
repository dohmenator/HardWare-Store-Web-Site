//I ran the following code on jdoodle.com via nodeJS
var dict = {};
populateDict(dict);

function populateDict(theDict) {
    for (let i = 1; i <= 10; i++) {
        curRandNum = parseInt(Math.random() * 5 + 1);
        console.log(curRandNum);
        if (!theDict[curRandNum])
            theDict[curRandNum] = 1;
        else
            theDict[curRandNum]++;
    }
    console.log(theDict);
}

/*
Sample Output:
1
3
2
5
3
3
2
4
5
3
{ '1': 1, '2': 2, '3': 4, '4': 1, '5': 2 }
*/