/**
 * @file 曲线段重新转换成bezier曲线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var util = require('graphics/util');
        var getPointHash = util.getPointHash;


        /**
         * 曲线段转bezier曲线
         * @param  {Array} paths      路径组
         * @param  {Object} bezierHash 待转换的点集合
         * @return {Array}            转换后的路径
         */
        function segment2Bezier(paths, bezierHash) {

            // 重新转换成曲线路径
            for (var i = 0, l = paths.length, j, jl; i < l; i++) {
                var path = paths[i];
                // 寻找第一个插值点
                var startIndex;
                for (j = 0, jl = path.length; j < jl; j++) {
                    var start = bezierHash[getPointHash(path[j])];
                    if (start) {
                        if (j + 8 < jl) {
                            if (start === bezierHash[getPointHash(path[j + 8])]) {
                                startIndex = j;
                            }
                            else {
                                startIndex = j - 8 > 0 ? j - 8 : jl + j - 8;
                            }
                        }
                        else {
                            startIndex = j - 8 > 0 ? j - 8 : jl + j - 8;
                            if (start !== bezierHash[getPointHash(path[startIndex])]) {
                                startIndex = j;
                            }
                        }
                        break;
                    }
                }

                if (startIndex > 0) {
                    path = [].concat(path.slice(startIndex)).concat(path.slice(0, startIndex));
                }

                // 移除插值点
                for (j = 0; j < path.length; j++) {
                    var point = bezierHash[getPointHash(path[j])];
                    if (point) {
                        path.splice(j, 9, point);
                        j++;
                    }
                }
                paths[i] = path;
            }

            return paths;
        }

        return segment2Bezier;
    }
);
