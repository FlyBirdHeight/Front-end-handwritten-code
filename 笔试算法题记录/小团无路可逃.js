let func = (n, x, y, list) => {
    let nodeList = new Array(n + 1).fill(0).map(v => {
        let d = [];
        d[0] = 0;
        d[1] = [];
        return d;
    });

    for (let i = 0; i < list.length; i++) {
        let [next, pre] = list[i];
        let nextNode = nodeList[next];
        let preNode = nodeList[pre];
        preNode[1].push(next);
        nextNode[0] = pre;
    }
    let bfs = (start, dis) => {
        let arr = [];
        arr.push(start);
        let visited = new Array(dis.length).fill(false);
        while (arr.length) {
            let cur = arr.shift();
            visited[cur] = true;
            let target = nodeList[cur];
            if (target[1].length != 0) {
                for (let i = 0; i < target[1].length; i++) {
                    let next = target[1][i];
                    if (!visited[next]) {
                        dis[next] = dis[cur] + 1;
                        arr.push(next);
                    }
                }
            }
        }

    }
    if (x === y) {
        return 0;
    }
    let disX = new Array();
    let disY = new Array();
    bfs(x, disX);
    bfs(y, disY);
    let maxTime = 0;
    for (let i = 1; i <= n; i++) {
        maxTime = Math.max(maxTime, disX[i])
    }

    return maxTime;
}

func(5, 1, 2, [[2, 1], [3, 1], [4, 2], [5, 3]])