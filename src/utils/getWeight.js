// len 代表指标个数
export default function(input, len) {
    var matrix = [];
    // 构造判断矩阵
    for (let i = 0; i < len; i++) {
        matrix.push(new Array(len).fill(1))
    };
    var count = 0;
    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            matrix[i][j] = input[count];
            count = count + 1;
        }
    }
    // 填写矩阵剩余元素 a[i][j] = 1 / a[j][i]
    for (let i = len - 1; i >= 0; i--) {
        for (let j = len - 1; j >= 0; j--) {
            matrix[i][j] = 1 / matrix[j][i]
        }
    }
    var column = new Array(len).fill();
    for (let j = 0; j < len; j++) {
        for (let i = 0; i < len; i++) {
            if (column[j] != undefined) {
                column[j] = column[j] + matrix[i][j];
            } else {
                column[j] = matrix[i][j];
            }
        }
    }
    // 矩阵归一化
    var matrixColumn = [];
    // 构造判断矩阵
    for (let i = 0; i < len; i++) {
        matrixColumn.push(new Array(len));
    };
    for (let j = 0; j < len; j++) {
        for (let i = 0; i < len; i++) {
            matrixColumn[i][j] = matrix[i][j] / column[j];
        }
    }
    // 获得行数组
    var line = new Array(len);
    for (let j = 0; j < len; j++) {
        for (let i = 0; i < len; i++) {
            if (line[i] != undefined) {
                line[i] = line[i] + matrixColumn[i][j];
            } else {
                line[i] = matrixColumn[i][j];
            }
        }
    }
    // 行归一化获取特征向量
    var w = new Array(len).fill(0);
    var sum = 0;
    for (let i = 0; i < len; i++) {
        sum += line[i]
    }
    for (let i = 0; i < len; i++) {
        w[i] = line[i] / sum;
    }
    var bw = new Array(len);
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (bw[i] != undefined) {
                bw[i] = bw[i] + matrix[i][j] * w[j];
            } else {
                bw[i] = matrix[i][j] * w[j];
            }
        }
    }
    var sumR = 0;
    for (let i = 0; i < len; i++) {
        sumR += bw[i] / (len * w[i]);
    }
    // 计算
    var ci = (sumR - len) / (len - 1);
    var cr = ci / getRI(len);
    if (cr >= 0.1) {
        return '判断矩阵设置错误';
    } else {
        return w;
    }
}

// 获取一致性指标 n为矩阵阶数
function getRI(n) {
    switch (n) {
        case 1:
            return 0;
        case 2:
            return 0;
        case 3:
            return 0.58;
        case 4:
            return 0.90;
        case 5:
            return 1.12;
        default:
            return Infinity;
    }
}