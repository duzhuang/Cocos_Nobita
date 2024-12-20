import { log } from "cc";

export enum LogType {
    /**关闭日志 */
    None = 0,
    /**网络层日志 */
    Net,
    /**数据结构层日志 */
    Model,
    /**业务层日志 */
    Business,
    /**s视图层日志*/
    View,
    /**配置日志 */
    Config,
    /**标准日志 */
    Trace,
}

/**日志的名字 */
var logNames = {
    "1": "网络日志",
    "2": "数据日志",
    "3": "业务日志",
    "4": "视图日志",
    "5": "配置日志",
    "6": "标准日志",
}

/**
 * 日志管理
 */
export default class Log {

    /**当前日志的类型 */
    private static m_type: number = 0;

    public static init(): void {
        this.m_type = LogType.Net | LogType.Model | LogType.Business | LogType.View | LogType.Config | LogType.Trace;
    }

    public static setType(type: LogType): void {
        if (type == null) {
            return;
        }
        this.m_type = type;
    }

    /**
     * 输出跟踪信息
     * @param msg 要输出的信息
     * @param color 信息的颜色，默认为白色
     */

    public static trace(msg: any, color: string = "color:#ffffff;") {
        if (!this.isOpned(LogType.Trace)) return;
        var backLog = console.log || log;
        backLog.call(null, "%c%s%s", color, this.getLogTimestamp(), msg);
    }

    /**
     * 以表格形式输出日志信息
     * @param msg 要输出的信息，必须是一个数组或对象
     * @param description 对信息的描述，可选参数
     */
    public static table(msg: any, description: string) {
        if (!this.isOpned(LogType.Trace)) return;
        console.table(msg)
    }

    /**
     * 输出网络层日志
     * @param msg 要输出的信息
     * @param description 描述
     */
    public static logNet(msg: any, description?: string) {
        this.orange(LogType.Net, msg, description)
    }

    /**
     * 输出数据结构层日志
     * @param msg 要输出的信息
     * @param description 描述
    */
    public static logModel(msg: any, description?: string) {
        this.violet(LogType.Model, msg, description)
    }

    /**
     * 输出业务层日志
     * @param msg 要输出的信息
     * @param description 描述
     */
    public static logBusiness(msg: any, description?: string) {
        this.blue(LogType.Business, msg, description)
    }

    /**
     * 输出视图层日志
     * @param msg 要输出的信息
     * @param description 描述
     */
    public static logView(msg: any, description?: string) {
        this.green(LogType.View, msg, description)
    }

    /**
     * 输出配置层日志
     * @param msg 要输出的信息
     * @param description 描述
     */
    public static logConfig(msg: any, description?: string) {
        this.gray(LogType.Config, msg, description)
    }

    private static orange(type: LogType, msg: any, description?: string) {
        this.print(type, "color:#ff6100;", msg, description)
    }

    private static blue(type: LogType, msg: any, description?: string) {
        this.print(type, "color:#00ffff;", msg, description)
    }

    private static green(type: LogType, msg: any, description?: string) {
        this.print(type, "color:#00ff00;", msg, description)
    }

    private static violet(type: LogType, msg: any, description?: string) {
        this.print(type, "color:#ff00ff;", msg, description)
    }

    private static gray(type: LogType, msg: any, description?: string) {
        this.print(type, "color:#808080;", msg, description)
    }

    private static print(type: LogType, color: string, msg: any, description?: string) {
        if (!this.isOpned(LogType.Trace)) return;
        const backLog = console.log || log;
        const typeName = logNames[type];
        if (description) {

        } else {
            backLog.call(null, "%c%s%s%s:%o", color, this.getLogTimestamp(), "[" + typeName + "]", this.getStackInfo(), msg);
        }
    }

    private static getStackInfo(): string {
        // 栈信息  == 5 的原因是堆栈在当前脚本就有5层，所以取第六层就是调用者的层级
        const defaultIndex: number = 5;
        let stack = new Error().stack;
        const stackArr = stack.split("\n");
        const result: Array<any> = [];
        stackArr.forEach((stackLine) => {
            // 去掉无用的信息,因为前7位是 “    at ”  所以去除无效信息
            stackLine = stackLine.substring(7);
            var stackLineArr = stackLine.split(" ");
            if (stackLineArr.length < 2) {
                result.push(stackLineArr[0]);
            } else {
                result.push({ [stackLineArr[0]]: stackLineArr[1] });
            }
        })

        let list: string[] = [];
        let splitList: Array<string> = [];

        if (defaultIndex < result.length - 1) {
            let value: string;
            for (let a in result[defaultIndex]) {
                splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[defaultIndex][a];
                    const start = value!.lastIndexOf("/");
                    const end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        const r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + ".ts->" + list[1] + "]";
        }
        return "";
    }

    private static isOpned(type: LogType): boolean {
        return (this.m_type & type) == LogType.None ? false : true;
    }

    /**获取当前的时间戳 */
    private static getLogTimestamp(): string {
        let date = new Date();
        let str = date.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = date.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = date.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = date.getMilliseconds().toString();
        timeStr += (str.length == 1 ? "00" + str : str.length == 2 ? "0" + str : str);
        timeStr = "[" + timeStr + "]";
        return timeStr;
    }

}

Log.init();