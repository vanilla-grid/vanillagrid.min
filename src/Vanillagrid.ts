import {
    Align,
    VerticalAlign,
    SelectionPolicy,
    ColorSet,
    GridInfo,
    GridCssInfo,
    CellColInfo,
    ColInfo,
    Cell,
    GridHeader,
    GridBody,
    GridFooter,
    CellData,
    CellRecord,
    Vanillagrid,
    VanillagridConstructor,
    GridMethods
} from './index'

function getVanillagrid(): Vanillagrid {
    function VanillagridInstance () {
        let GRIDS: Record<string, GridMethods> = {};
        
        this.gridIds = [];
        this.sortAscSpan = null;
        this.sortDescSpan = null;
        this.filterSpan = null;
        this.footerFormula = {};
        this.dataType = {};
        this.lessoreq0x7ffByte = 2;
        this.lessoreq0xffffByte = 3;
        this.greater0xffffByte = 4;
        this.get = function(gridId: string): GridMethods {
            if(this.gridIds.indexOf(gridId) < 0) throw new Error('The grid id is not defined.');
            return GRIDS[gridId];
        };

        this.defaultGridInfo = {
            locked : false,
            lockedColor : true,
            resizable : true,
            redoable : true,
            redoCount : 30,
            visible : true,
            headerVisible : true,
            rownumVisible : true,
            rownumSize : '60px',
            statusVisible : true,
            selectionPolicy : SelectionPolicy.RANGE,
            nullValue : null,
            dateFormat : 'yyyy-mm-dd',
            monthFormat : 'yyyy-mm',
            alterRow : true,
            frozenColCount : 0,
            frozenRowCount : 0,
            sortable : true,
            filterable : true,
            allCheckable : true,
            checkedValue : 'Y',
            uncheckedValue : 'N',
        };

        this.defaultGridCssInfo = {
            width : '100%',
            height : '600px',
            margin : '0 auto',
            padding : '0',
            sizeLevel : 5,
            verticalAlign : VerticalAlign.CENTER,
            cellFontSize : 14,
            cellMinHeight : 21,
            horizenBorderSize : 1,
            verticalBorderSize : 1,
            gridFontFamily : 'Arial',
            editorFontFamily : 'Arial',
            overflowWrap : null,
            wordBreak : null,
            whiteSpace : null,
            linkHasUnderLine : true,
            invertColor : false,
            color : null,
            colorSet : null,
            gridBorderColor : null,
            headerCellBackColor : null,
            headerCellBorderColor : null,
            headerCellFontColor : null,
            footerCellBackColor : null,
            footerCellBorderColor : null,
            footerCellFontColor : null,
            bodyBackColor : null,
            bodyCellBackColor : null,
            bodyCellBorderColor : null,
            bodyCellFontColor : null,
            editorBackColor : null,
            editorFontColor : null,
            selectCellBackColor : null,
            selectCellFontColor : null,
            selectColBackColor : null,
            selectColFontColor : null,
            selectRowBackColor : null,
            selectRowFontColor : null,
            mouseoverCellBackColor : null,
            mouseoverCellFontColor : null,
            lockCellBackColor : null,
            lockCellFontColor : null,
            alterRowBackColor : null,
            alterRowFontColor : null,
            buttonFontColor : null,
            buttonBorderColor : null,
            buttonBackColor : null,
            buttonHoverFontColor : null,
            buttonHoverBackColor : null,
            buttonActiveFontColor : null,
            buttonActiveBackColor : null,
            linkFontColor : null,
            linkHoverFontColor : null,
            linkActiveFontColor : null,
            linkVisitedFontColor : null,
            linkFocusFontColor : null,
        };

        this.defaultColInfo = {
            rowMerge : false,
            colMerge : false,
            colVisible : true,
            required : false,
            resizable : true,
            sortable : true,
            filterable : true,
            originWidth : '80px',
            dataType : 'text',
            selectSize : '100%',
            format : null,
            codes : null,
            defaultCode : null,
            maxLength : null,
            maxByte : null,
            maxNumber : null,
            minNumber : null,
            roundNumber : null,
            align : null,
            verticalAlign : null,
            overflowWrap : null,
            wordBreak : null,
            whiteSpace : null,
            backColor : null,
            fontColor : null,
            fontBold : false,
            fontItalic : false,
            fontThruline : false,
            fontUnderline : false,
        };

        this.checkRequiredFunction = function (cellData: any) {
            if(cellData && window[cellData.gridId]) {
                alert(cellData.row + ' For the row, please enter the value for ' + cellData.name + '.');
                (window as any)[cellData.gridId].editCell(cellData.row, cellData.col);
                return;
            }
            if(cellData && this.get(cellData.gridId)) {
                alert(cellData.row + ' For the row, please enter the value for ' + cellData.name + '.');
                this.get(cellData.gridId).editCell(cellData.row, cellData.col);
                return;
            }
        };

        this._docEvent_mousedown = null;
        this._docEvent_mouseup = null;
        this._docEvent_keydown = null;
        this._docEvent_copy = null;
        this._docEvent_paste = null;

        this._VanillaGrid = null;
        this._GridHeader = null;
        this._GridBody = null;
        this._GridFooter = null;
        this._GridData = null;

        this.create = function () {
            const vg = this;
            const vanillagrids: NodeListOf<HTMLElement> = document.querySelectorAll('vanilla-grid');
            for(const vanillagrid of vanillagrids) {
                if(!vanillagrid.getAttribute('id'))  throw new Error(`The grid's id is a required attribute.`);
                vg.gridIds.push(vanillagrid.getAttribute('id')!);
            }
            if (new Set(vg.gridIds).size !== vg.gridIds.length) throw new Error('There is a duplicate grid ID.');
            if (vg.gridIds.length <= 0) return;

            const utils = {
                isDragging: false,
                onHeaderDragging: false,
                isHeaderDragging: false,
                mouseX: 0,
                mouseY: 0,
                activeGrid: null,
                activeGridEditor: null,
                editOldValue: null,
                editNewValue: null,
                filterOldValue: null,
                filterNewValue: null,
                mouseoverCell: null,
                validateNumber (param: string | number): number {
                    const number = Number(param);
                    if (isNaN(number)) {
                        throw new Error('The provided parameter is not a number.');
                    }
                    return number;
                },
                validateIntegerAndZero (param: string | number): number {
                    const number = Number(param);
                    if (isNaN(number)) {
                        throw new Error('The provided parameter is not a number.');
                    }
                    if (!Number.isInteger(number)) {
                        throw new Error('The provided number is not an integer.');
                    }
                    return number;
                },
                validatePositiveIntegerAndZero (param: string | number): number {
                    const number = Number(param);
                    if (isNaN(number)) {
                        throw new Error('The provided parameter is not a number.');
                    }
                    if (!Number.isInteger(number)) {
                        throw new Error('The provided number is not an integer.');
                    }
                    if (number < 0) {
                        throw new Error('The provided number is not a positive integer.');
                    }
                    return number;
                },
                extractNumberAndUnit (val: string | null): any {
                    if (val === null || val === undefined) return '';
                    val = '' + val.trim();
                    const regex = /^(\d+)(\D*)$/;
                    const match = val.match(regex);
                    if (match) {
                        const unit = match[2] === '' ? null : match[2];
                        return { number: parseInt(match[1], 10), unit: unit };
                    } else {
                        return '';
                    }
                },
                toLowerCase (val: string | null): string {
                    if (!val || typeof val !== 'string') return '';
                    return val.toLowerCase();
                },
                toUpperCase (val: string | null): string {
                    if (!val || typeof val !== 'string') return '';
                    return val.toUpperCase();
                },
                isIncludeEnum (enumObj: Record<string, string>, value: string): boolean {
                    return Object.values(enumObj).includes(value);
                },
                isValidDate (year: number, month: number, day: number): boolean {
                    const date = new Date(year, month - 1, day);
                    return date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == day;
                },
                isValidEmail (email: string): boolean {
                    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return regex.test(email);
                },
                getCutByteLength (str: string, cutByte: number): string | null {
                    if (str === null || str === undefined) return null;
                    str = String(str);
                    let byteLength = 0;
                    let cutIndex = str.length;
                
                    for (let i = 0; i < str.length; i++) {
                        const charCode = str.charCodeAt(i);
                        if (charCode <= 0x7F) {
                            byteLength += 1;
                        } else if (charCode <= 0x7FF) {
                            byteLength += vg.lessoreq0x7ffByte;
                        } else if (charCode <= 0xFFFF) {
                            byteLength += vg.lessoreq0xffffByte;
                        } else {
                            byteLength += vg.greater0xffffByte;
                        }
                        if (byteLength > cutByte) {
                            cutIndex = i;
                            break;
                        }
                    }
                    return str.substring(0, cutIndex);
                },
                deepCopy (object: any, visited?: any[]): any {
                    if (object === null || typeof object !== 'object') {
                        return object;
                    }
                    if (object.constructor !== Object && object.constructor !== Array) {
                        return object;
                    }
                    if (!visited) visited = [];
                    for (let i = 0; i < visited.length; i++) {
                        if (visited[i].source === object) {
                            return visited[i].copy;
                        }
                    }
                    let copy: any;
                    if (Array.isArray(object)) {
                        copy = [];
                        visited.push({ source: object, copy: copy });
                
                        for (let j = 0; j < object.length; j++) {
                            copy[j] = this.deepCopy(object[j], visited);
                        }
                    } else {
                        copy = {};
                        visited.push({ source: object, copy: copy });
                
                        for (let key in object) {
                            if (object.hasOwnProperty(key)) {
                                copy[key] = this.deepCopy(object[key], visited);
                            }
                        }
                    }
                    return copy;
                },
                deepFreeze<T extends Record<string, any>> (object: T, noFreezeArr?: any[]): T {
                    const propNames = Object.getOwnPropertyNames(object);
                    const _this = this;
                
                    propNames.forEach((name) => {
                        const prop = object[name];
                        if (noFreezeArr && noFreezeArr.indexOf(name) < 0 && typeof prop == 'object' && prop !== null) {
                            _this.deepFreeze(prop, noFreezeArr);
                        }
                    });
                    
                    return Object.freeze(object);
                },
                getArrayElementWithBoundCheck (arr: any[], idx: number | null): any {
                    idx = this.getOnlyNumberWithNaNToNull(idx);
                    if (idx === null || idx === undefined) throw new Error('Please enter the correct index.');
                    if (idx < 0 || idx >= arr.length) throw new Error('Index is out of range. Please enter the correct index.');
                    return arr[idx];
                },
                removeAllChild (element: HTMLElement) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                },
                getBorderWidth (el: HTMLElement): number {
                    const style = getComputedStyle(el);
                    const borderLeftWidth = this.extractNumberAndUnit(style.borderLeftWidth).number;
                    const borderRightWidth = this.extractNumberAndUnit(style.borderRightWidth).number;
                    return borderLeftWidth + borderRightWidth
                },
                getBorderHeight (el: HTMLElement): number {
                    const style = getComputedStyle(el);
                    const borderTopWidth = this.extractNumberAndUnit(style.borderTopWidth).number;
                    const borderBottomWidth = this.extractNumberAndUnit(style.borderBottomWidth).number;
                    return borderTopWidth + borderBottomWidth
                },
                getHexColorFromColorName (colorName: string): string {
                    if (/^#[0-9a-fA-F]{6}$/.test(colorName)) {
                        return colorName;
                    }
                    
                    const dummyDiv = document.createElement('div');
                    dummyDiv.style.color = colorName;
                    document.body.appendChild(dummyDiv);
                    
                    
                    const color = window.getComputedStyle(dummyDiv).color;
                    document.body.removeChild(dummyDiv);
                    
                    
                    const rgb: RegExpMatchArray | null = color.match(/\d+/g); 
                    const hex = '#' + ((1 << 24) + (+rgb![0] << 16) + (+rgb![1] << 8) + +rgb![2]).toString(16).slice(1);
                    
                    return hex;
                },
                getColorShade (hexColor: string): string {
                    const r = parseInt(hexColor.slice(1, 3), 16);
                    const g = parseInt(hexColor.slice(3, 5), 16);
                    const b = parseInt(hexColor.slice(5, 7), 16);

                    
                    let lightCount = 0;
                    if (r >= 0xa0) lightCount++;
                    if (g >= 0xa0) lightCount++;
                    if (b >= 0xa0) lightCount++;

                    
                    return lightCount >= 2 ? 'light' : 'dark';
                },
                getAdjustHexColor (color: string, diff: string): string {
                    if (color.startsWith('#')) {
                        color = color.slice(1);
                    }
                    
                    let diffValue = parseInt(diff, 16);
                    if (diff.startsWith('-')) {
                        diffValue = -parseInt(diff.slice(1), 16);
                    }
                    
                    let r = parseInt(color.slice(0, 2), 16);
                    let g = parseInt(color.slice(2, 4), 16);
                    let b = parseInt(color.slice(4, 6), 16);

                    r = parseInt(String(r + diffValue));
                    g = parseInt(String(g + diffValue));
                    b = parseInt(String(b + diffValue));

                    return '#'
                         + (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, '0')
                         + (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, '0')
                         + (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, '0');
                },
                getMostLightHexColor (color: string): string {
                    if (color.startsWith('#')) {
                        color = color.slice(1);
                    }
                                
                    let r = parseInt(color.slice(0, 2), 16);
                    let g = parseInt(color.slice(2, 4), 16);
                    let b = parseInt(color.slice(4, 6), 16);

                    r = parseInt(String(210 + r / 255 * 50));
                    g = parseInt(String(210 + g / 255 * 50));
                    b = parseInt(String(210 + b / 255 * 50));
                    
                    return '#'
                        + (r < 0 ? 0 : r > 255 ? 248 : r).toString(16).padStart(2, '0')
                        + (g < 0 ? 0 : g > 255 ? 248 : g).toString(16).padStart(2, '0')
                        + (b < 0 ? 0 : b > 255 ? 248 : b).toString(16).padStart(2, '0');
                },
                getInvertColor (hex: string | null): string | null {
                    if (!hex) return null;
                    if (hex.startsWith('#')) {
                        hex = hex.slice(1);
                    }
                    
                    let r = 255 - parseInt(hex.slice(0, 2), 16);
                    let g = 255 - parseInt(hex.slice(2, 4), 16);
                    let b = 255 - parseInt(hex.slice(4, 6), 16);
                    
                    r = r < 127.5 ? r + 16 : r - 16;
                    g = g < 127.5 ? g + 16 : g - 16;
                    b = b < 127.5 ? b + 16 : b - 16;
                    
                    return '#'
                        + (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, '0')
                        + (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, '0')
                        + (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, '0');
                },
                getCssTextFromObject (cssObject: Record<string, string>): string {
                    let cssText = '';
                    if (!cssObject || cssObject.constructor !== Object || Object.keys(cssObject).length === 0) return cssText;
                    
                    let csses = Object.entries(cssObject);
                    for(let i = 0; i < csses.length; i++) {
                        if (csses[i].length < 2) continue;
                        cssText += csses[i][0].trim() + ':' + csses[i][1].trim() + ';';
                    }
                    
                    return cssText;
                },
                getColorFromColorSet (colorSet: ColorSet.BLACK
                    | ColorSet.BLUE
                    | ColorSet.BROWN
                    | ColorSet.GREEN
                    | ColorSet.LIGHT_GREEN
                    | ColorSet.LIGHT_RED
                    | ColorSet.ORANGE
                    | ColorSet.PURPLE
                    | ColorSet.RED
                    | ColorSet.SKYBLUE
                    | ColorSet.YELLOW
                    | string | null): string {
                    switch(colorSet) {
                        case 'skyblue':
                            return '#91c8e4';
                        case 'blue':
                            return '#4682a9';
                        case 'light-red' :
                            return '#fdd2bf';
                        case 'red' :
                            return '#b61919';
                        case 'light-green' :
                            return '#a4be7b';
                        case 'green' :
                            return '#217346';
                        case 'orange' :
                            return '#f79327';
                        case 'yellow' :
                            return '#ffe569';
                        case 'purple' :
                            return '#804674';
                        case 'brown' :
                            return '#675d50';
                        case 'black' :
                            return '#272829';
                        default :
                            throw new Error('Please enter the correct colorSet.');
                    }
                },
                setColorSet (cssInfo: GridCssInfo): void {
                    let color = cssInfo.color;
                    if (!color) color = '#f3f3f3';
                    if (color !== 'black' && color !== '#000' && color !== '#000000'
                        && this.getHexColorFromColorName(color) === '#000000') throw new Error('Please enter the correct color.');
                    color = this.getHexColorFromColorName(color);
                    const isLight = this.getColorShade(color) === 'light';
                    const fontColor = isLight ? '#333333' : '#ffffff';
                    const alterRowColorModify = this.getMostLightHexColor(color);
                    
                    cssInfo.gridBorderColor = this.getAdjustHexColor(color, '-4f');
                    cssInfo.bodyBackColor = '#ffffff';

                    cssInfo.headerCellBackColor = color;
                    cssInfo.headerCellBorderColor = this.getAdjustHexColor(color, '-4f');
                    cssInfo.headerCellFontColor = fontColor;

                    cssInfo.footerCellBackColor = color;
                    cssInfo.footerCellBorderColor = this.getAdjustHexColor(color, '-4f');
                    cssInfo.footerCellFontColor = fontColor;

                    cssInfo.bodyCellBackColor = '#ffffff';
                    cssInfo.bodyCellBorderColor = this.getAdjustHexColor(color, '-f');
                    cssInfo.bodyCellFontColor = '#333333';

                    cssInfo.editorBackColor = '#fefefe';
                    cssInfo.editorFontColor = '#333333';

                    cssInfo.selectCellBackColor = this.getAdjustHexColor(color, '-2f');
                    cssInfo.selectCellFontColor = fontColor;

                    cssInfo.selectColBackColor = this.getAdjustHexColor(color, '-2f');
                    cssInfo.selectColFontColor = fontColor;

                    cssInfo.selectRowBackColor = this.getAdjustHexColor(alterRowColorModify, isLight ? '-f' : '-2f');
                    cssInfo.selectRowFontColor = '#333333';

                    cssInfo.mouseoverCellBackColor = color;
                    cssInfo.mouseoverCellFontColor = fontColor;

                    cssInfo.lockCellBackColor = this.getAdjustHexColor(alterRowColorModify, isLight ? '-6' : '-1f');
                    cssInfo.lockCellFontColor = '#666666';

                    cssInfo.alterRowBackColor = alterRowColorModify;
                    cssInfo.alterRowFontColor = '#333333';
                    
                    cssInfo.buttonFontColor = fontColor;
                    cssInfo.buttonBackColor = color
                    cssInfo.buttonBorderColor = this.getAdjustHexColor(color, isLight ? '-cf' : '-4f');
                    cssInfo.buttonHoverFontColor = fontColor;
                    cssInfo.buttonHoverBackColor = this.getAdjustHexColor(color, '-f');
                    cssInfo.buttonActiveFontColor = fontColor;
                    cssInfo.buttonActiveBackColor = this.getAdjustHexColor(color, '-2f');

                    cssInfo.linkFontColor = this.getAdjustHexColor(color, isLight ? '-cf' : '0');
                    cssInfo.linkHoverFontColor = this.getAdjustHexColor(color, isLight ? '-4f' : 'af');
                    cssInfo.linkActiveFontColor = this.getAdjustHexColor(color, isLight ? '-cf' : '0');
                    cssInfo.linkVisitedFontColor = this.getAdjustHexColor(color, isLight ? '-5f' : '2f');
                    cssInfo.linkFocusFontColor = this.getAdjustHexColor(color, isLight ? '-4f' : 'bf');
                },
                setInvertColor (cssInfo: GridCssInfo) {
                    cssInfo.gridBorderColor = this.getInvertColor(cssInfo.gridBorderColor);
                    cssInfo.headerCellBackColor = this.getInvertColor(cssInfo.headerCellBackColor);
                    cssInfo.headerCellBorderColor = this.getInvertColor(cssInfo.headerCellBorderColor);
                    cssInfo.headerCellFontColor = this.getInvertColor(cssInfo.headerCellFontColor);
                    cssInfo.footerCellBackColor = this.getInvertColor(cssInfo.footerCellBackColor);
                    cssInfo.footerCellBorderColor = this.getInvertColor(cssInfo.footerCellBorderColor);
                    cssInfo.footerCellFontColor = this.getInvertColor(cssInfo.footerCellFontColor);
                    cssInfo.bodyBackColor = this.getInvertColor(cssInfo.bodyBackColor);
                    cssInfo.bodyCellBackColor = this.getInvertColor(cssInfo.bodyCellBackColor);
                    cssInfo.bodyCellBorderColor = this.getInvertColor(cssInfo.bodyCellBorderColor);
                    cssInfo.bodyCellFontColor = this.getInvertColor(cssInfo.bodyCellFontColor);
                    cssInfo.editorBackColor = this.getInvertColor(cssInfo.editorBackColor);
                    cssInfo.editorFontColor = this.getInvertColor(cssInfo.editorFontColor);
                    cssInfo.selectCellBackColor = this.getInvertColor(cssInfo.selectCellBackColor);
                    cssInfo.selectCellFontColor = this.getInvertColor(cssInfo.selectCellFontColor);
                    cssInfo.selectColBackColor = this.getInvertColor(cssInfo.selectColBackColor);
                    cssInfo.selectColFontColor = this.getInvertColor(cssInfo.selectColFontColor);
                    cssInfo.selectRowBackColor = this.getInvertColor(cssInfo.selectRowBackColor);
                    cssInfo.selectRowFontColor = this.getInvertColor(cssInfo.selectRowFontColor);
                    cssInfo.mouseoverCellBackColor = this.getInvertColor(cssInfo.mouseoverCellBackColor);
                    cssInfo.mouseoverCellFontColor = this.getInvertColor(cssInfo.mouseoverCellFontColor);
                    cssInfo.lockCellBackColor = this.getInvertColor(cssInfo.lockCellBackColor);
                    cssInfo.lockCellFontColor = this.getInvertColor(cssInfo.lockCellFontColor);
                    cssInfo.alterRowBackColor = this.getInvertColor(cssInfo.alterRowBackColor);
                    cssInfo.alterRowFontColor = this.getInvertColor(cssInfo.alterRowFontColor);
                    cssInfo.buttonFontColor = this.getInvertColor(cssInfo.buttonFontColor);
                    cssInfo.buttonBorderColor = this.getInvertColor(cssInfo.buttonBorderColor);
                    cssInfo.buttonBackColor = this.getInvertColor(cssInfo.buttonBackColor);
                    cssInfo.buttonHoverFontColor = this.getInvertColor(cssInfo.buttonHoverFontColor);
                    cssInfo.buttonHoverBackColor = this.getInvertColor(cssInfo.buttonHoverBackColor);
                    cssInfo.buttonActiveFontColor = this.getInvertColor(cssInfo.buttonActiveFontColor);
                    cssInfo.buttonActiveBackColor = this.getInvertColor(cssInfo.buttonActiveBackColor);
                    cssInfo.linkFontColor = this.getInvertColor(cssInfo.linkFontColor);
                    cssInfo.linkHoverFontColor = this.getInvertColor(cssInfo.linkHoverFontColor);
                    cssInfo.linkActiveFontColor = this.getInvertColor(cssInfo.linkActiveFontColor);
                    cssInfo.linkVisitedFontColor = this.getInvertColor(cssInfo.linkVisitedFontColor);
                    cssInfo.linkFocusFontColor = this.getInvertColor(cssInfo.linkFocusFontColor);
                },
                getAttributeWithCheckRequired (attributeName: string, el: HTMLElement): string | null {
                    if (!el.getAttribute(attributeName)) {
                        throw new Error(`'`+ attributeName + `' is required.`);
                    }
                    else {
                        return el.getAttribute(attributeName);
                    }
                },
                getAttributeOnlyNumberIntegerOrZero (attributeName: string, el: HTMLElement): number | null {
                    let numStr = el.getAttribute(attributeName);
                    if (numStr === null || numStr === undefined || numStr === '') return null;
                    let num = Number(numStr);
                    if (Number.isInteger(num) && num >= 0) {
                        return num;
                    }
                    return null
                },
                getAttributeOnlyNumberInteger (attributeName: string, el: HTMLElement): number | null {
                    let numStr = el.getAttribute(attributeName);
                    if (numStr === null || numStr === undefined || numStr === '') return null;
                    let num = Number(numStr);
                    if (Number.isInteger(num)) {
                        return num;
                    }
                    return null;
                },
                getAttributeOnlyNumber (attributeName: string, el: HTMLElement): number | null {
                    let numStr = el.getAttribute(attributeName);
                    if (numStr === null || numStr === undefined || numStr === '') return null;
                    let num = Number(numStr);
                    if (isNaN(num)) {
                        return null;
                    }
                    return num;
                },
                getAttributeOnlyBoolean (attributeName: string, el: HTMLElement): boolean | null {
                    let bool = el.getAttribute(attributeName);
                    if (bool === null || bool === undefined || bool === '') return null;
                    
                    return this.toLowerCase(bool) === 'true';
                },
                getOnlyNumberWithNaNToZero (value: any): number {
                    const returnValue = Number(value);
                    if (isNaN(returnValue)) {
                        return 0;
                    }
                    return returnValue;
                },
                getOnlyNumberWithNaNToNull (value: any): number | null {
                    const returnValue = Number(value);
                    if (isNaN(returnValue)) {
                        return null;
                    }
                    return returnValue;
                },
                getCheckboxCellTrueOrFalse (cell: Cell): boolean {
                    const value = cell.cValue;
                    const checkedValue = (this as any)[cell.gId].info.gCheckedValue;
                    const uncheckedValue = (this as any)[cell.gId].info.gUncheckedValue;
                    if (typeof value === 'boolean') {
                        if (value) {
                            cell.cValue = checkedValue;
                        }
                        else {
                            cell.cValue = uncheckedValue;
                        }
                        return value;
                    }
                    if (value !== checkedValue) {
                        cell.cValue = uncheckedValue;
                        return false;
                    }
                    return true;
                },
                isElementVisible (el: HTMLElement): boolean {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
                        const x = rect.left + (rect.right - rect.left) / 2;
                        const y = rect.top + (rect.bottom - rect.top) / 2;
                        const topElement = document.elementFromPoint(x, y);
                        return el.contains(topElement) || el === topElement;
                    }
                    return false;
                },
                getFirstChildTextNode (el: HTMLElement): ChildNode | null {
                    for (let i = 0; i < el.childNodes.length; i++) {
                        const child = el.childNodes[i];
                        if (child.nodeType === Node.TEXT_NODE) {
                            return child;
                        }
                    }
                    return null;
                },
                nvl<T,U> (value: T, nullValue: U): T | U {
                    if (value === null || value === undefined || value === '') {
                        return nullValue;
                    }
                    return value;
                },
                getVerticalAlign (verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): string {
                    switch (this.toLowerCase(verticalAlign)) {
                        case 'top':
                            return 'flex-start';
                        case 'bottom':
                            return 'flex-end';
                        default:
                            return 'center';
                    }
                },
                reConnectedCallbackElement (cell: Cell) {
                    if (['ghd','gbd','gfd'].indexOf(cell.gType) < 0) return;
                    const parent = cell.parentNode;
                    if (parent) {
                        this.setGridDataPosition(cell);
                        parent.removeChild(cell);
                        parent.appendChild(cell);
                    }
                },
                checkIsValueOrData (keyValueOrDatas: (object | object[])[]): boolean | null {
                    let isKeyValue = null;
                    for(const keyValueOrData of keyValueOrDatas) {
                        if (keyValueOrData.constructor === Object) {
                            if (isKeyValue !==null && isKeyValue === false) throw new Error('Please insert valid datas.');
                            isKeyValue = true;
                        }
                        else {
                            if (!Array.isArray(keyValueOrData)) throw new Error('Please insert valid datas.');
                            if (keyValueOrData[0] && keyValueOrData[0].constructor !== Object) throw new Error('Please insert valid datas.');
                            if (isKeyValue !==null && isKeyValue === true) throw new Error('Please insert valid datas.');
                            isKeyValue = false;
                        }
                    }
                    return isKeyValue;
                },
                modifyColSize (gId: string, targetCell: Cell, modifySize: number) {
                    if (!targetCell) return;
                    if (!targetCell.cResizable) return;
                    if (targetCell.cId === 'v-g-rownum' || targetCell.cId === 'v-g-status') return;
                    if ((this as any).doEventWithCheckChanged(gId, '_onResize', targetCell.cId) === false) {
                        return;
                    }

                    const gHeader = (this as any)[gId]._getHeader();
                    const gBody = (this as any)[gId]._getBody();
                    const gFooter = (this as any)[gId]._getFooter();

                    const styleGridTemplateColumnsArr = gHeader.style.gridTemplateColumns.split(' ');
                    const oldColWidth = styleGridTemplateColumnsArr[targetCell.col - 1];
                    if ((this as any).extractNumberAndUnit(oldColWidth).unit === '%') {
                        if (modifySize > 0) {
                            modifySize = 1;
                        }
                        else if (modifySize < 0) {
                            modifySize = -1;
                        }
                        else {
                            modifySize = 0;
                        }
                    }
                    const newColWidth = ((this as any).extractNumberAndUnit(oldColWidth).number + modifySize) + (this as any).extractNumberAndUnit(oldColWidth).unit;
                    styleGridTemplateColumnsArr[targetCell.col - 1] = newColWidth;
                    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
                    gHeader.style.gridTemplateColumns = styleGridTemplateColumns;
                    gBody.style.gridTemplateColumns = styleGridTemplateColumns;
                    gFooter.style.gridTemplateColumns = styleGridTemplateColumns;
                },
                changeColSize (gId: string, targetCol: number, changeSize: number) {
                    if (typeof changeSize !== 'number' || changeSize < 0) throw new Error('The format of size is only zero or positive integers.');

                    const _grid = (this as any)[gId];
                    if (_grid._getHeaderCell(1, targetCol).frozenCol) return;
                    const isVisible = changeSize !== 0;
                    for(let row = 1; row <= (this as any)[gId].getHeaderRowCount(); row++) {
                        const tempHeaderCell = _grid._getHeaderCell(row, targetCol);
                        tempHeaderCell.cColVisible = isVisible;
                        (this as any).reConnectedCallbackElement(tempHeaderCell);
                    }
                    for(let row = 1; row <= (this as any)[gId].getRowCount(); row++) {
                        _grid._getCell(row, targetCol).cColVisible = isVisible;
                    }
                    for(let row = 1; row <= (this as any)[gId].getFooterRowCount(); row++) {
                        const tempFooterCell = _grid._getFooterCell(row, targetCol);
                        tempFooterCell.cColVisible = isVisible;
                        (this as any).reConnectedCallbackElement(tempFooterCell);
                    }
                    
                    const header = _grid._getHeader();
                    const body = _grid._getBody();
                    const footer = _grid._getFooter();

                    const styleGridTemplateColumnsArr = header.style.gridTemplateColumns.split(' ');
                    const oldColWidth = styleGridTemplateColumnsArr[targetCol - 1];
                    const newColWidth = changeSize + (this as any).extractNumberAndUnit(oldColWidth).unit;
                    styleGridTemplateColumnsArr[targetCol - 1] = newColWidth;
                    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
                    header.style.gridTemplateColumns = styleGridTemplateColumns;
                    body.style.gridTemplateColumns = styleGridTemplateColumns;
                    footer.style.gridTemplateColumns = styleGridTemplateColumns;
                },
                selectCell (targetCell: Cell): boolean {
                    const gId = targetCell.gId;
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCell', targetCell.row, targetCell.cId) === false) {
                        return false;
                    }
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveRow', targetCell.row) === false) {
                        return false;
                    }
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCol', targetCell.cId) === false) {
                        return false;
                    }
                    if ((this as any)[gId].info.gSelectionPolicy === 'none') return false;
                    (this as any).resetSelection(gId);
                    (this as any)[gId].variables._targetCell = targetCell;
                    (this as any).selectCells(targetCell, targetCell);
                    (this as any).focusCell(targetCell);
                    return true;
                },
                focusCell (targetCell: Cell) {
                    const gId = targetCell.gId;
                    const gridRect = (this as any)[gId].getBoundingClientRect();
                    const header = (this as any)[gId]._getHeader();
                    const footer = (this as any)[gId]._getFooter();
                    const cellBRect = targetCell.getBoundingClientRect();
                    const cellTopPosition = cellBRect.top - gridRect.top - header.clientHeight;
                    const cellBottomPosition = cellBRect.bottom - gridRect.top + footer.clientHeight;
                    const cellLeftPosition = cellBRect.left - gridRect.left;
                    const cellRightPosition = cellBRect.right - gridRect.left;
                    if (cellTopPosition < 0) {
                        (this as any)[gId].scrollTop += cellTopPosition;
                    } else if (cellBottomPosition > (this as any)[gId].clientHeight) {
                        (this as any)[gId].scrollTop += cellBottomPosition - (this as any)[gId].clientHeight;
                    }
                    if (cellLeftPosition < 0) {
                        (this as any)[gId].scrollLeft += cellLeftPosition;
                    } else if (cellRightPosition > (this as any)[gId].clientWidth) {
                        (this as any)[gId].scrollLeft += cellRightPosition - (this as any)[gId].clientWidth;
                    }
                },
                resetSelection (gId: string) {
                    if (!gId) return;
                    if ((this as any)[gId].variables._activeRows) (this as any)[gId].variables._activeRows = [];
                    if ((this as any)[gId].variables._activeCols) (this as any)[gId].variables._activeCols = [];
                    if ((this as any)[gId].variables._activeCells) (this as any)[gId].variables._activeCells = [];
                    if ((this as any)[gId].variables._targetCell) (this as any)[gId].variables._targetCell = [];
                    
                    this.unselectCells(gId);
                },
                unselectCells (gId: string) {
                    const selectedCells: Cell[] = (this as any)[gId].querySelectorAll('.' + gId + '_selected-cell');
                    for(const cell of selectedCells) {
                        cell.classList.remove(gId + '_selected-cell');
                        if (cell.cDataType === 'link' || cell.cDataType === 'select') {
                            const childList = cell.querySelectorAll('*');
                            childList.forEach((child: Element) => {
                                child.classList.remove(gId + '_selected-cell');
                            });
                        }
                        if(vg.dataType) {
                            Object.keys(vg.dataType).forEach((key) => {
                                if(cell.cDataType === key) {
                                    if(vg.dataType[key].onUnselected) {
                                        if(typeof vg.dataType[key].onUnselected !== 'function') throw new Error('onSelected must be a function.');
                                        vg.dataType[key].onUnselected(cell, (this as any)[gId].__getData(cell));
                                    }
                                }
                            });
                        }
                    }
                    const selectedCols = (this as any)[gId].querySelectorAll('.' + gId + '_selected-col');
                    for(const cell of selectedCols) {
                        cell.classList.remove(gId + '_selected-col');
                    }
                    const selectedRows = (this as any)[gId].querySelectorAll('.' + gId + '_selected-row');
                    for(const cell of selectedRows) {
                        cell.classList.remove(gId + '_selected-row');
                    }
                },
                selectCells (startCell: Cell, endCell: Cell, focusCell?: Cell): boolean {
                    const gId = startCell.gId;
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCells', startCell.row, startCell.cId, endCell.row, endCell.cId) === false) {
                        return false;
                    }
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveRows', startCell.row, endCell.row) === false) {
                        return false;
                    }
                    if ((this as any).doEventWithCheckChanged(gId, '_onActiveCols', startCell.cId, endCell.cId) === false) {
                        return false;
                    }
                    if ((this as any)[gId].info.gSelectionPolicy !== 'range' && startCell !== endCell) {
                        return false;
                    }
                    const startRow = startCell.row < endCell.row ? startCell.row : endCell.row;
                    const endRow = startCell.row > endCell.row ? startCell.row : endCell.row;
                    const startCol = startCell.col < endCell.col ? startCell.col : endCell.col;
                    const endCol = startCell.col > endCell.col ? startCell.col : endCell.col;

                    (this as any)[gId].variables._activeCells = [];
                    (this as any)[gId].variables._activeRows = [];
                    (this as any)[gId].variables._activeCols = [];
                    
                    let tempCell: Cell;
                    for(let r = startRow; r <= endRow; r++) {
                        for(let c = startCol; c <= endCol; c++) {
                            if (r === startRow) (this as any)[gId].variables._activeCols.push(c);
                            tempCell = (this as any)[gId]._getCell(r,c);
                            if (!tempCell.cUntarget && (this as any).isCellVisible(tempCell)) {
                                (this as any)[gId].variables._activeCells.push(tempCell);
                                tempCell.classList.add(gId + '_selected-cell');
                                if (tempCell.cDataType === 'link' || tempCell.cDataType === 'select') {
                                    const childList = tempCell.querySelectorAll('*');
                                    childList.forEach(child => {
                                        child.classList.add(gId + '_selected-cell');
                                    });
                                }
                                if(vg.dataType) {
                                    Object.keys(vg.dataType).forEach((key) => {
                                        if(tempCell.cDataType === key) {
                                            if(vg.dataType[key].onSelected) {
                                                if(typeof vg.dataType[key].onSelected !== 'function') throw new Error('onSelected must be a function.');
                                                vg.dataType[key].onSelected(tempCell, (this as any)[gId].__getData(tempCell));
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        (this as any)[gId].variables._activeRows.push(r);
                    }
                    (this as any).setActiveCol(gId);
                    (this as any).setActiveRow(gId);

                    (this as any).focusCell(focusCell ? focusCell : endCell);
                    return true;
                },
                setActiveCol (gId: string) {
                    const _grid = (this as any)[gId];
                    for(const colIdx of (this as any)[gId].variables._activeCols) {
                        for(let r = 1; r <= _grid.getHeaderRowCount(); r++) {
                            _grid._getHeaderCell(r, colIdx).classList.add(gId + '_selected-col');
                        }
                    }
                },
                setActiveRow (gId: string) {
                    for(const rowIdx of (this as any)[gId].variables._activeRows) {
                        for(const cell of (this as any)[gId]._getRow(rowIdx)) {
                            cell.classList.add(gId + '_selected-row');
                        }
                    }
                },
                scrollInterval: null,
                startScrolling (gId: string, action: string) {
                    if ((this as any).scrollInterval) return;
                    (this as any).scrollInterval = setInterval(() => {
                        if ((this as any)[gId].info.gSelectionPolicy !== 'range') return;
                        const _grid = (this as any)[gId];
                        if (_grid.variables._activeCells.length <= 0) return;
                        const startCell = _grid.variables._activeCells[0];
                        const endCell = _grid.variables._activeCells[_grid.variables._activeCells.length - 1];
                        let newTargetCell;
                        switch (action) {
                            case 'up':
                                newTargetCell = (this as any).getMoveRowCell(startCell, -1);
                                (this as any).unselectCells(gId);
                                (this as any).selectCells(newTargetCell, endCell, newTargetCell);
                                break;
                            case 'down':
                                newTargetCell = (this as any).getMoveRowCell(endCell, 1);
                                (this as any).unselectCells(gId);
                                (this as any).selectCells(startCell, newTargetCell);
                                break;
                            case 'left':
                                newTargetCell = (this as any).getMoveColCell(startCell, -1);
                                (this as any).unselectCells(gId);
                                (this as any).selectCells(newTargetCell, endCell, newTargetCell);
                                break;
                            case 'right':
                                newTargetCell = (this as any).getMoveColCell(endCell, 1);
                                (this as any).unselectCells(gId);
                                (this as any).selectCells(startCell, newTargetCell);
                                break;
                            default:
                                break;
                        }
                    }, 100); 
                },
                stopScrolling () {
                    if ((this as any).scrollInterval) clearInterval((this as any).scrollInterval);
                    (this as any).scrollInterval = null;
                },
                copyGrid (copyCells: Cell[]) {
                    const copyText = (this as any).getCopyText(copyCells);
                    if (utils.doEventWithCheckChanged(copyCells[0].gId, '_onCopy', copyCells[0].row, copyCells[0].cId, copyCells[copyCells.length - 1].row, copyCells[copyCells.length - 1].cId, copyText) === false) {
                        return;
                    }
                    navigator.clipboard.writeText(copyText).then(() => {
                    }, () => {
                    });
                },
                getCopyText (copyCells: Cell[]): string {
                    let copyText = '';
                    let lastRow: number | null = null;
                    copyCells.forEach((cell) => {
                        let cellRow = cell.row;
                        let cellText = String((this as any).getCellText(cell));
                        Object.keys(vg.dataType).forEach((key) => {
                            if(cell.cDataType === key) {
                                if(vg.dataType[key].getCopyValue) {
                                    if(typeof vg.dataType[key].getCopyValue !== 'function') throw new Error('getCopyValue must be a function.');
                                    cellText = vg.dataType[key].getCopyValue(cell.cValue);
                                }
                            }
                        });
                        if (cellText.includes('\n')) cellText = '"' + cellText + '"';
                        
                        if (lastRow !== null && lastRow !== cellRow) {
                            copyText += '\n'; 
                        }
                        else if (lastRow === cellRow) {
                            copyText += '\t'; 
                        }
                        copyText += cellText;
                        lastRow = cellRow;
                    });
                    return copyText;
                },
                modifyCellValue (cell: Cell, value: any, recodes: CellRecord[], isMethodCalled = false) {
                    const _grid = (this as any)[cell.gId];
                    if (!isMethodCalled) {
                        if (!(this as any).isCellVisible(cell)) return;
                        if (cell.cUntarget || cell.cLocked) return;
                    }
                    value = (this as any).getValidValue(cell, value);
                    if (cell.cValue === value) return;

                    const oldValue = cell.cValue;
                    const newValue = value;
                    
                    if (recodes && Array.isArray(recodes)) {
                        recodes.push({
                            'cell' : cell,
                            'oldValue' : oldValue,
                            'newValue' : newValue,
                        })
                    }
                    
                    if(!_grid.getRowStatus(cell.row)) _grid.setRowStatus(cell.row, 'U');
                    cell.cValue  = value; 
                    utils.reConnectedCallbackElement(cell);
                    (this as any).reloadGridWithModifyCell(cell.gId, cell.cIndex);
                },
                getRecodesWithModifyValue (cell: Cell, value: any, isMethodCalled = false): CellRecord[] {
                    const recodes: CellRecord[] = [];
                    (this as any).modifyCellValue(cell, value, recodes, isMethodCalled);

                    return recodes;
                },
                pasteGrid (e: ClipboardEvent, grid: any) {
                    const _this = (this as any);
                    const gId = grid.gId
                    const clipboardData = e.clipboardData || (window as any).clipboardData;
                    const startCell = _this[gId].variables._activeCells[0];
                    const text = clipboardData.getData('text');

                    if (utils.doEventWithCheckChanged(startCell.gId, '_onPaste', startCell.row, startCell.cId, text) === false) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }

                    const pasteRows = [];
                    const recodes = [];

                    let row = '';
                    let inQuotes = false;
                    for (let i = 0; i < text.length; i++) {
                        let currentChar = text[i];
                        let nextChar = text[i + 1];

                        
                        if (currentChar === '"') {
                            inQuotes = !inQuotes;
                        }

                        if (!inQuotes && (currentChar === '\n' || (currentChar === '\r' && nextChar === '\n'))) {
                            
                            pasteRows.push(row);
                            row = ''; 
                            if (currentChar === '\r' && nextChar === '\n') i++; 
                        } else {
                            row += currentChar;
                        }
                    }
                    if (row) {
                        pasteRows.push(row);
                    }

                    const startRowIndex = startCell.row;
                    const startColIndex = startCell.col;
                    
                    const maxRow = grid.getRowCount(); 
                    const maxCol = grid.getColCount(); 

                    let unvisibleRowCount = 0;
                    let rowIndex = 0;
                    for(let r = 0; r < pasteRows.length; r++) {
                        const currentRowIndex = startRowIndex + rowIndex + unvisibleRowCount;
                        
                        if (currentRowIndex > maxRow) return;
                        const currentRow = grid._getRow(currentRowIndex);
                        
                        if (!currentRow[0].cRowVisible || currentRow[0].cFilter) {
                            unvisibleRowCount++;
                            let nextRow = 1;
                            let nextRowCell = _this[gId]._getCell(currentRow[0].row + nextRow, 1);
                            while(nextRowCell) {
                                if (!nextRowCell.cRowVisible || nextRowCell.cFilter) {
                                    unvisibleRowCount++;
                                }
                                else {
                                    break;
                                }
                                nextRow++;
                                nextRowCell = _this[gId]._getCell(currentRow[0].row + nextRow, 1);
                            }
                            continue;
                        }

                        let unvisibleColCount = 0;
                        let colIndex = 0;
                        const pasteCols = pasteRows[rowIndex].split('\t');
                        for(let c = 0; c < pasteCols.length; c++) {
                            const currentColIndex = startColIndex + colIndex - 1 + unvisibleColCount;
                            
                            if (currentColIndex >= maxCol) break;
                            const cell = currentRow[currentColIndex];
                            
                            if (!cell.cColVisible) {
                                unvisibleColCount++;
                                let nextCol = 1;
                                let nextColCell = currentRow[currentColIndex + nextCol];
                                while(nextColCell) {
                                    if (!nextColCell.cColVisible) {
                                        unvisibleColCount++;
                                    }
                                    else {
                                        break;
                                    }
                                    nextCol++;
                                    nextColCell = currentRow[currentColIndex + nextCol];
                                }
                                continue;
                            }

                            let colText = pasteCols[colIndex];
                            if (['select','checkbox','button','link'].indexOf(cell.cDataType!) < 0
                                && !cell.cUntarget && !cell.cLocked) {
                                colText = colText.replaceAll('"', '');
                                
                                let doPaste = true;
                                Object.keys(vg.dataType).forEach((key) => {
                                    if(cell.cDataType === key) {
                                        if(vg.dataType[key].getPasteValue) {
                                            if(typeof vg.dataType[key].getPasteValue !== 'function') throw new Error('getPasteValue must be a function.');
                                            colText = vg.dataType[key].getPasteValue(grid.__getData(cell), colText);
                                        }
                                        else {
                                            doPaste = false;
                                        }
                                    }
                                });

                                if(doPaste) recodes.push(..._this.getRecodesWithModifyValue(cell, colText));
                            }
                            colIndex++;
                        }
                        rowIndex++;
                    }
                    if (recodes.length > 0) _this.recodeGridModify(gId, recodes);
                },
                modifyCell () {
                    if (!(this as any).activeGridEditor) return;
                    let cell = (this as any).activeGridEditor.parentNode;
                    if (cell.cUntarget || cell.cLocked) return;
                    (this as any).editNewValue = (this as any).activeGridEditor.value;
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.cDataType === key) {
                            if(vg.dataType[key].getEditedValue) {
                                if(typeof vg.dataType[key].getEditedValue !== 'function') throw new Error('getEditedValue must be a function.');
                                (this as any).editNewValue = vg.dataType[key].getEditedValue((this as any).activeGridEditor, (this as any)[cell.gId].__getData(cell));
                            }
                            else {
                                (this as any).editNewValue = (this as any).editOldValue;
                            }
                        }
                    });
                    (this as any).removeGridEditor();
                    if ((this as any).doEventWithCheckChanged(cell.gId, '_onBeforeChange', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue) === false) {
                        return false;
                    }
                    const value = (this as any).editNewValue;
                    const recodes = (this as any).getRecodesWithModifyValue(cell, value);
                    (this as any).recodeGridModify(cell.gId, recodes);
                    (this as any).doEventWithCheckChanged(cell.gId, '_onAfterChange', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue);
                    return;
                },
                getTabCell (targetCell: Cell, isNegative: boolean): Cell | null {
                    if (!targetCell) return null;
                    let row = targetCell.row;
                    let col = isNegative ? targetCell.col - 1 : targetCell.col + 1;
                    let newTargetCell;

                    while(!newTargetCell
                        && row >= 1
                        && row <= (this as any).activeGrid.getRowCount()) {
                        while(!newTargetCell
                            && col >= 1
                            && col <= (this as any).activeGrid.getColCount()) {
                            newTargetCell = (this as any).activeGrid._getCell(row, col);
                            if (!newTargetCell) {
                            }
                            else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
                                newTargetCell = null;
                            }
                            else if (newTargetCell.cUntarget) {
                                newTargetCell = null;
                            }
                            else if (!(this as any).isCellVisible(newTargetCell)) {
                                newTargetCell = null;
                            }
                            col = isNegative ? col - 1 : col + 1;
                        }
                        row = isNegative ? row - 1 : row + 1;
                        col = isNegative ? (this as any).activeGrid.getColCount() : 1;
                    }
                    if (!newTargetCell) newTargetCell = targetCell;
                    return newTargetCell;
                },
                getMoveRowCell (targetCell: Cell, mRow: number): Cell | null {
                    if (!targetCell) return null;
                    let row = targetCell.row;
                    let col = targetCell.col;
                    let newTargetCell;
                    if (!mRow) return targetCell;
                    while(!newTargetCell) {
                        row = row + mRow;
                        if (row < 1 || row > (this as any)[targetCell.gId].getRowCount()) break;
                        newTargetCell = (this as any).activeGrid._getCell(row, col);
                        if (!newTargetCell) {
                        }
                        else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
                            newTargetCell = null;
                        }
                        else if (newTargetCell.cUntarget) {
                            newTargetCell = null;
                        }
                        else if (!(this as any).isCellVisible(newTargetCell)) {
                            newTargetCell = null;
                        }
                    }
                    if (!newTargetCell) newTargetCell = targetCell;

                    return newTargetCell;
                },
                getMoveColCell (targetCell: Cell, mCol: number): Cell | null {
                    if (!targetCell) return null;
                    let row = targetCell.row;
                    let col = targetCell.col;
                    let newTargetCell;
                    if (!mCol) return targetCell;
                    while(!newTargetCell) {
                        col = col + mCol;
                        if (col < 1 || col > (this as any)[targetCell.gId].getColCount()) break;
                        newTargetCell = (this as any).activeGrid._getCell(row, col);
                        if (!newTargetCell) {
                        }
                        else if (newTargetCell.rowMerge || newTargetCell.colMerge) {
                            newTargetCell = null;
                        }
                        else if (newTargetCell.cUntarget) {
                            newTargetCell = null;
                        }
                        else if (!(this as any).isCellVisible(newTargetCell)) {
                            newTargetCell = null;
                        }
                    }
                    if (!newTargetCell) newTargetCell = targetCell;

                    return newTargetCell;
                },
                sort (gId: string, arr: Record<string, any>[], id: string, isAsc = true, isNumSort = false): Record<string, any>[] {
                    const copiedArr = (this as any).deepCopy(arr);
                    const _grid = (this as any)[gId];
                    
                    copiedArr.sort((a: Record<string, any>, b: Record<string, any>) => {
                        const aItem = a.find((item: Record<string, any>) => item.id === id);
                        const bItem = b.find((item: Record<string, any>) => item.id === id);
                        let aValue = aItem ? aItem.value : null
                        const aDataType = aItem ? aItem.dataType : null
                        let bValue = bItem ? bItem.value : null
                        const bDataType = bItem ? bItem.dataType : null
                        
                        let _isNumSort = isNumSort;
                        if (typeof aValue === 'number' || typeof bValue === 'number') _isNumSort = true;

                        if (aValue === _grid.info.gNullValue) aValue = null;
                        if (bValue === _grid.info.gNullValue) bValue = null;

                        if (aDataType === 'select' && aValue !== null && Array.isArray(aValue)) {
                            let aSelectOption = aValue.find(item => item.selected);
                            if (aSelectOption) {
                                aValue = aSelectOption.text;
                            }
                            else {
                                if (aValue.length > 0) {
                                    aValue = aValue[0].text !== undefined ? aValue[0].text : null; 
                                }
                                else {
                                    aValue = null;
                                }
                            }
                        }
                        else if (aDataType === 'link' && aValue !== null && aValue.constructor === Object) {
                            aValue = aValue.text;
                        }

                        if (bDataType === 'select' && bValue !== null && Array.isArray(bValue)) {
                            let bSelectOption = bValue.find(item => item.selected);
                            if (bSelectOption) {
                                bValue = bSelectOption.text;
                            }
                            else {
                                if (bValue.length > 0) {
                                    bValue = bValue[0].text !== undefined ? bValue[0].text : null; 
                                }
                                else {
                                    bValue = null;
                                }
                            }
                        }
                        else if (bDataType === 'link' && bValue !== null && bValue.constructor === Object) {
                            bValue = bValue.text;
                        }

                        if(vg.dataType) {
                            Object.keys(vg.dataType).forEach((key) => {
                                if(aDataType === key) {
                                    if(vg.dataType[key].getSortValue) {
                                        if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                                        aValue = vg.dataType[key].getSortValue(aValue);
                                    }
                                    else {
                                        aValue = aItem.text
                                    }
                                }
                                if(bDataType === key) {
                                    if(vg.dataType[key].getSortValue) {
                                        if(typeof vg.dataType[key].getSortValue !== 'function') throw new Error('getSortValue must be a function.');
                                        bValue = vg.dataType[key].getSortValue(bValue);
                                    }
                                    else {
                                        bValue = bItem.text
                                    }
                                }
                            });
                        }

                        
                        if (_isNumSort) {
                            const aNumber = aValue === null ? NaN : Number(aValue);
                            const bNumber = bValue === null ? NaN : Number(bValue);

                            if (!isNaN(aNumber) && !isNaN(bNumber)) {
                                return isAsc !== false ? aNumber - bNumber : bNumber - aNumber;
                            }
                            if (isNaN(aNumber)) aValue = null;
                            if (isNaN(bNumber)) bValue = null;
                        }
                        
                        
                        if (aValue === null && bValue === null) return 0; 
                        if (aValue === null) return isAsc !== false ? 1 : -1; 
                        if (bValue === null) return isAsc !== false ? -1 : 1;

                        if (!aValue.localeCompare && !bValue.localeCompare) return 0
                        if (!aValue.localeCompare) return isAsc !== false ? 1 : -1;
                        if (!bValue.localeCompare) return isAsc !== false ? -1 : 1;

                        if (_isNumSort) {
                            return isAsc !== false ? 
                                aValue.localeCompare(bValue, undefined, {numeric: true}) : 
                                bValue.localeCompare(aValue, undefined, {numeric: true});
                        } else {
                            return isAsc !== false ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                        }
                    });
                    _grid.variables._sortToggle[id] = isAsc;
                    return copiedArr;
                },
                setFilterOptions (select: any, options: any) {
                    const selectedValue = select.value;
                    (this as any).removeAllChild(select);
                    options.forEach((opt: any) => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        select.appendChild(option); 
                    });
                    if (selectedValue) {
                        select.value = selectedValue;
                    }
                },
                reloadFilterValue (gId: string, colId: number | string) {
                    const _grid = (this as any)[gId];
                    if (!_grid || !_grid.info.gFilterable) return;
                    const colInfo = _grid.__getColInfo(colId);
                    if (!colInfo.cFilterable) return;

                    colInfo.cFilterValues = new Set();
                    for(let r = 1; r <= _grid.getRowCount(); r++) {
                        let filterValue;
                        let tempCell = _grid._getCell(r, colInfo.cIndex);
                        if (!tempCell || !tempCell.cRowVisible || !tempCell.cColVisible) continue;
                        filterValue = (this as any).getCellText(tempCell);

                        Object.keys(vg.dataType).forEach((key) => {
                            if(tempCell.cDataType === key) {
                                if(vg.dataType[key].getFilterValue) {
                                    if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                                    filterValue = vg.dataType[key].getFilterValue(tempCell.cValue);
                                }
                            }
                        });

                        if(filterValue === '' || filterValue === null || filterValue === undefined || filterValue === _grid.info.gNullValue) filterValue = '$$NULL';
                        colInfo.cFilterValues.add(filterValue);
                    }
                    (this as any).reloadFilter(gId, colId);
                },
                reloadFilter (gId: string, colId: string) {
                    const _grid = (this as any)[gId];
                    const filterSelect = _grid.__getHeaderFilter(colId);
                    if (!filterSelect) return;
                    const colInfo = _grid.__getColInfo(colId);
                    const filterValues = colInfo.cFilterValues;
                    const dataType = colInfo.cDataType;
                    if (!filterValues) return;
                    let options = [];
                    let option = {
                        value: '$$ALL',
                        text: '*',
                    };
                    options.push(option);

                    filterValues.forEach((value: any) => {
                        const option = {
                            value : value,
                            text : value
                        };
                        if (value === '$$NULL') option.text = _grid.info.gNullValue;
                        if (dataType === 'checkbox') {
                            option.text = value === _grid.info.gCheckedValue ? '☑' : '☐';
                        }
                        options.push(option);
                    });

                    const selectedValue = filterSelect.value;
                    (this as any).removeAllChild(filterSelect);
                    options.forEach((opt: any) => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        filterSelect.appendChild(option); 
                    });
                    if (selectedValue) {
                        filterSelect.value = selectedValue;
                        colInfo.cFilterValue = selectedValue;
                    }
                },
                reloadColForMerge (gId: string, colIndex: number) {
                    const _grid = (this as any)[gId];
                    const colInfo = _grid.__getColInfo(colIndex);
                    let preCell, nowCell;
                    let r, c;
                    
                    if (colInfo.cRowMerge) {
                        c = colInfo.cIndex;
                        
                        for(r = 1; r <= _grid.getRowCount(); r++) {
                            nowCell = _grid._getCell(r, c);
                            delete nowCell.rowSpan;
                            delete nowCell.rowMerge;
                            delete nowCell.colSpan;
                            delete nowCell.colMerge;
                        }
                        
                        for(r = 2; r <= _grid.getRowCount(); r++) {
                            preCell = _grid._getCell(r - 1, c);
                            nowCell = _grid._getCell(r, c);
                            if (preCell
                                && (this as any).isCellVisible(preCell)
                                && preCell.cDataType === nowCell.cDataType
                                && (this as any).getCellText(preCell) === (this as any).getCellText(nowCell)
                            ) {
                                for(let rSpan = preCell.row - 1; rSpan > 0; rSpan--) {
                                    preCell = _grid._getCell(rSpan, c);
                                    if (preCell.rowMerge !== true) {
                                        preCell.rowSpan = (this as any).nvl(preCell.rowSpan, 1) + 1;
                                        break;
                                    }
                                }
                                nowCell.rowMerge = true;
                            }
                        }
                        
                        for(r = 1; r <= _grid.getRowCount(); r++) {
                            nowCell = _grid._getCell(r, c);
                            (this as any).reConnectedCallbackElement(nowCell);
                        }
                    }
                    if (colInfo.cColMerge && !_grid.__getColInfo(colIndex - 1).cRowMerge) {
                        const cells = _grid._getCells();
                        
                        for(r = 1; r <= _grid.getRowCount(); r++) {
                            for(c = colInfo.cIndex - 1; c <= colInfo.cIndex; c++) {
                                nowCell = _grid._getCell(r, c);
                                delete nowCell.rowSpan;
                                delete nowCell.rowMerge;
                                delete nowCell.colSpan;
                                delete nowCell.colMerge;
                            }
                        }
                        
                        c = colInfo.cIndex;
                        for(r = 1; r <= _grid.getRowCount(); r++) {
                            preCell = cells[r - 1][c - 2]
                            nowCell = cells[r - 1][c - 1]
                            if (preCell
                                && (this as any).isCellVisible(preCell)
                                && preCell.cDataType === nowCell.cDataType
                                && (this as any).getCellText(preCell) === (this as any).getCellText(nowCell)
                            ) {
                                for(let cSpan = preCell.col - 1; cSpan > 2; cSpan--) {
                                    preCell = cells[r - 1][cSpan];
                                    if (preCell.colMerge !== true) {
                                        preCell.colSpan = (this as any).nvl(preCell.colSpan, 1) + 1;
                                        break;
                                    }
                                }
                                nowCell.colMerge = true;
                            }
                        }
                        
                        for(r = 1; r <= _grid.getRowCount(); r++) {
                            for(c = colInfo.cIndex - 1; c <= colInfo.cIndex; c++) {
                                nowCell = _grid._getCell(r, c);
                                (this as any).reConnectedCallbackElement(nowCell);
                            }
                        }
                    }
                },
                reloadGridWithModifyCell (gId: string, colIndex: number) {
                    (this as any).reloadFooterValue(gId);
                    (this as any).reloadFilterValue(gId, colIndex);
                    const nextColInfo = (this as any)[gId].__getColInfo(colIndex + 1);
                    if (nextColInfo && nextColInfo.cColMerge) {
                        (this as any).reloadColForMerge(gId, colIndex + 1);
                    }
                    else {
                        (this as any).reloadColForMerge(gId, colIndex);
                    }
                },
                reloadGridForMerge (gId: string) {
                    for(let c = 3; c <= (this as any)[gId].getColCount(); c++) {
                        (this as any).reloadColForMerge(gId, c);
                    }
                },
                reloadFooterValue (gId: string) {
                    const _grid = (this as any)[gId];
                    const footerCells = _grid._getFooterCells();
                    for(const footers of footerCells) {
                        for(const footerCell of footers) {
                            if (footerCell.cFooter !== null && footerCell.cFooter !== undefined) {
                                (this as any).reConnectedCallbackElement(footerCell);
                            }
                        }
                    }
                },
                setGridDataRowCol (el: Cell, row: number, col: number) {
                    el.row = row;
                    el.col = col;
                    el.cIndex = col;
                    (this as any).setGridDataPosition(el);
                },
                setGridDataPosition (el: Cell) {
                    const row = el.row;
                    const col = el.col;
                    el.style.gridRowStart = String(row);
                    el.style.gridRowEnd = String(row + 1);
                    el.style.gridColumnStart = String(col);
                    el.style.gridColumnEnd = String(col + 1);
                },
                getGridCell (gId: string, colInfo: CellColInfo, valueOrData: any, rowCount: number, colCount: number): Cell {
                    let data, dataKey, tempData;

                    if (valueOrData && valueOrData.constructor === Object) {
                        data = {
                            value : valueOrData[colInfo.cId]
                        };
                    }
                    else if (valueOrData && Array.isArray(valueOrData)) {
                        for(tempData of valueOrData) {
                            if (tempData.id === colInfo.cId) {
                                data = tempData;
                                break;
                            }
                        }
                    }

                    if (!data) {
                        data = {
                            value : null
                        };
                    }

                    const tempGridData = document.createElement('v-g-d') as any;
                    tempGridData.gId = gId;
                    tempGridData.gType = 'gbd';

                    Object.keys(colInfo).forEach(key => {
                        if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
                            dataKey = key.charAt(1).toLowerCase() + key.slice(2);
                            tempGridData[key] = dataKey in data ? data[dataKey] : colInfo[key as keyof CellColInfo];
                        }
                    });
                    switch (tempGridData.cId) {
                        case 'v-g-rownum':
                            tempGridData.cValue = rowCount;
                            break;
                        case 'v-g-status':
                            tempGridData.cValue = utils.getCodeValue(['C','U','D'], null, data.value);
                            break;
                        default:
                            tempGridData.cValue = utils.getValidValue(tempGridData, data.value);
                            break;
                    }
                    if (colInfo.cFilterable && tempGridData.cColVisible) colInfo.cFilterValues!.add(tempGridData.textContent);
                    (this as any).setGridDataRowCol(tempGridData, rowCount, colCount);
                    return tempGridData as Cell;
                },
                isCellVisible (cell: Cell) {
                    if (!cell) return;
                    return !(cell.cColVisible === false || cell.cRowVisible === false || cell.cFilter === true);
                },
                getFirstCellValidNumber (grid: any, footerCell: Cell): number | null {
                    let returnNumber;
                    let tempCell;
                    for(let r = 1; r < grid.getRowCount(); r++ ) {
                        tempCell = grid._getCell(r, footerCell.col);
                        if (!(this as any).isCellVisible(tempCell)) continue;
                        returnNumber = (this as any).getOnlyNumberWithNaNToNull(tempCell!.cValue);
                        if (returnNumber) return returnNumber;
                    }
                    return null;
                },
                recodeGridModify (gId: string, recodes: CellRecord[]) {
                    if (recodes.length <= 0) return;
                    const _grid = (this as any)[gId];
                    if (_grid.variables._recodeseq < _grid.variables._recodes.length) {
                        _grid.variables._recodes.splice(_grid.variables._recodeseq);
                        
                    }
                    _grid.variables._recodes.push(recodes);
                    _grid.variables._recodeseq = _grid.variables._recodeseq + 1;

                    if (_grid.variables._recodeseq > _grid.info.gRedoCount){
                        _grid.variables._recodes.shift();
                        _grid.variables._recodeseq = _grid.variables._recodeseq - 1;
                    }
                },
                redoundo (gId: string, isRedo?: boolean): boolean {
                    const _grid = (this as any)[gId];
                    if (!_grid.info.gRedoable) return false;
                    const _isRedo = isRedo === false ? false : true;
                    if (_isRedo && _grid.variables._recodeseq <= 0) return false;
                    if (!_isRedo && _grid.variables._recodeseq + 1 > _grid.variables._recodes.length) return false;
                    _grid.variables._recodeseq = _isRedo ? _grid.variables._recodeseq - 1 : _grid.variables._recodeseq + 1
                    const redoCellInfos = _isRedo ? _grid.variables._recodes[_grid.variables._recodeseq] : _grid.variables._recodes[_grid.variables._recodeseq - 1];
                    if (!redoCellInfos || !Array.isArray(redoCellInfos)) return false;
                    (this as any).selectCell(redoCellInfos[0].cell);
                    for(const redoCellInfo of redoCellInfos) {
                        redoCellInfo.cell.cValue = _isRedo ? redoCellInfo.oldValue : redoCellInfo.newValue;
                        (this as any).reConnectedCallbackElement(redoCellInfo.cell);
                        (this as any).reloadGridWithModifyCell(redoCellInfo.cell.gId, redoCellInfo.cell.cIndex);
                    }
                    return true;
                },
                removeGridEditor (): boolean {
                    if (!(this as any).activeGridEditor) return false;
                    const cell = (this as any).activeGridEditor.targetCell;
                    (this as any).doEventWithCheckChanged(cell.gId, '_onEditEnding', cell.row, cell.cId, (this as any).editOldValue, (this as any).editNewValue)
                    cell.style.padding = '';
                    cell.style.fontSize = '';
                    (this as any).activeGridEditor.parentNode.removeChild((this as any).activeGridEditor);
                    (this as any).activeGridEditor = null; 
                    return true;
                },
                addBagicEventListenerToGridEditor (gridEditor: HTMLElement) {
                    gridEditor.addEventListener('keydown', function (e) {
                        const _grid = utils.activeGrid as any;
                        const gId = _grid.gId;
                        const cell = _grid.variables._targetCell;
                        if (utils.doEventWithCheckChanged(gId, '_onKeydownEditor', e) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        let newTargetCell: Cell | null;
                        switch (e.key) {
                            case 'Enter':
                                if (!e.shiftKey) {
                                    utils.modifyCell();
                                    newTargetCell = utils.getMoveRowCell(cell!, 1);
                                    utils.selectCell(newTargetCell!);
                                    e.stopPropagation();
                                    e.preventDefault();
                                }
                                break;
                            case 'Escape':
                                utils.editNewValue = utils.editOldValue;
                                utils.removeGridEditor();
                                e.stopPropagation();
                                e.preventDefault();
                                break;
                            case 'Tab':
                                utils.modifyCell();
                                newTargetCell = utils.getTabCell(cell!, e.shiftKey);
                                utils.selectCell(newTargetCell!);
                                e.stopPropagation();
                                e.preventDefault();
                                break;
                            case 'F2':
                                utils.modifyCell();
                                e.stopPropagation();
                                e.preventDefault();
                                break;
                            default:
                                break;
                        }
                    });
                    gridEditor.addEventListener('input', function(e) {
                        const _grid = utils.activeGrid as any;
                        const gId = _grid.gId;
                        utils.doEventWithCheckChanged(gId, '_onInputEditor', e);
                    })
                },
                setBagicAttributesToGridEditor (gridEditor: any, cell: Cell) {
                    gridEditor.eId = cell.gId + '_Editor';
                    gridEditor.gId = cell.gId;
                    gridEditor.targetCell = cell;
                    gridEditor.style.width = cell.offsetWidth + 'px'; 
                    gridEditor.style.height = cell.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';
                    gridEditor.classList.add(gridEditor.gId + '_editor');
                },
                createGridEditorTextarea (cell: Cell): HTMLElement {
                    const gridEditor = document.createElement('textarea') as unknown as any;
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.placeholder;
                    gridEditor.classList.add(gridEditor.gId + '_editor_textarea');
                    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
                    (this as any).editOldValue = value;
                    gridEditor.value = (this as any).editOldValue; 
                    
                    gridEditor.addEventListener('input', function (e: any) {
                        e.target.style.height = e.target.scrollHeight + gridEditor.offsetHeight - gridEditor.clientHeight + 'px';

                    }, false);

                    gridEditor.addEventListener('keyup', function (e: any) {
                        if (e.target.value && e.target.parentNode && e.target.parentNode.cMaxLength) {
                            e.target.value = e.target.value.substring(0, e.target.parentNode.cMaxLength);
                        }
                        
                        if (e.target.value && e.target.parentNode && e.target.parentNode.cMaxByte) {
                            e.target.value = utils.getCutByteLength(e.target.value, e.target.parentNode.cMaxByte);
                        }
                    }, false);

                    (this as any).addBagicEventListenerToGridEditor(gridEditor);

                    return gridEditor;
                },
                createGridEditorNumber (cell: Cell): HTMLInputElement {
                    const gridEditor = document.createElement('input');
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.classList.add((gridEditor as any).gId + '_editor_number');
                    gridEditor.setAttribute('type','number');
                    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
                    (this as any).editOldValue = value;
                    gridEditor.value = (this as any).editOldValue; 

                    (this as any).addBagicEventListenerToGridEditor(gridEditor);
                    return gridEditor;
                },
                createGridEditorDate (cell: Cell): HTMLInputElement {
                    const gridEditor = document.createElement('input');
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.classList.add((gridEditor as any).gId + '_editor_date');
                    gridEditor.setAttribute('type','date');
                    (this as any).editOldValue = (this as any).getDateWithInputDateFormat(cell.cValue);
                    gridEditor.value = (this as any).editOldValue; 

                    (this as any).addBagicEventListenerToGridEditor(gridEditor);
                    return gridEditor;
                },
                createGridEditorMonth (cell: Cell): HTMLInputElement {
                    const gridEditor = document.createElement('input');
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.classList.add((gridEditor as any).gId + '_editor_month');
                    gridEditor.setAttribute('type','month');
                    (this as any).editOldValue = (this as any).getDateWithInputMonthFormat(cell.cValue);
                    gridEditor.value = (this as any).editOldValue; 

                    (this as any).addBagicEventListenerToGridEditor(gridEditor);
                    return gridEditor;
                },
                createGridEditorMask (cell: Cell): HTMLInputElement {
                    const gridEditor = document.createElement('input');
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.classList.add((gridEditor as any).gId + '_editor_mask');
                    gridEditor.setAttribute('type','text');
                    const value = (this as any)[cell.gId].info.gNullValue === cell.cValue? null : cell.cValue;
                    (this as any).editOldValue = value;
                    gridEditor.value = (this as any).editOldValue; 
                    gridEditor.addEventListener('keyup', function (e: any) {
                        e.target.value = utils.getMaskValue(e.target.targetCell.cFormat, e.target.value);
                    });
                    (this as any).addBagicEventListenerToGridEditor(gridEditor);
                    return gridEditor;
                },
                createGridEditorCode (cell: Cell): HTMLInputElement {
                    const gridEditor = document.createElement('input');
                    (this as any).setBagicAttributesToGridEditor(gridEditor, cell);
                    gridEditor.classList.add((gridEditor as any).gId + '_editor_code');
                    gridEditor.setAttribute('type','text');
                    const value = cell.cValue;
                    (this as any).editOldValue = value;
                    gridEditor.value = (this as any).editOldValue; 
                    (this as any).addBagicEventListenerToGridEditor(gridEditor);
                    return gridEditor;
                },
                createGridEditor (cell: Cell, isEnterKey = false) {
                    if (cell.cLocked || cell.cUntarget) return;
                    if (['select','checkbox','button','link'].indexOf(cell.cDataType!) >= 0) return;
                    
                    (this as any).removeGridEditor();
                    let gridEditor;
                    switch (cell.cDataType) {
                        case 'text':
                            gridEditor = (this as any).createGridEditorTextarea(cell);
                            break;
                        case 'number':
                            gridEditor = (this as any).createGridEditorNumber(cell);
                            break;
                        case 'date':
                            gridEditor = (this as any).createGridEditorDate(cell);
                            break;
                        case 'month':
                            gridEditor = (this as any).createGridEditorMonth(cell);
                            break;
                        case 'mask':
                            gridEditor = (this as any).createGridEditorMask(cell);
                            break;
                        case 'code':
                            gridEditor = (this as any).createGridEditorCode(cell);
                            break;
                        default:
                            Object.keys(vg.dataType).forEach((key) => {
                                if(cell.cDataType === key) {
                                    if(vg.dataType[key].getEditor) {
                                        if(typeof vg.dataType[key].getEditor !== 'function') throw new Error('getEditor must be a function.');
                                        const call_endEdit = () => {
                                            utils.editNewValue = utils.editOldValue;
                                            utils.removeGridEditor();
                                        }
                                        const call_modify = () => {
                                            (this as any).modifyCell()
                                        }
                                        gridEditor = vg.dataType[key].getEditor(cell, (this as any)[cell.gId].__getData(cell), () => {call_modify()}, () => {call_endEdit()});
                                        if(gridEditor) {
                                            if(!(gridEditor instanceof HTMLElement) || gridEditor.nodeType !== 1)  throw new Error('getEditor must return an html element.');
                                            (gridEditor as any).eId = cell.gId + '_Editor';
                                            (gridEditor as any).gId = cell.gId;
                                            (gridEditor as any).targetCell = cell;
                                            gridEditor.classList.add((gridEditor as any).gId + '_editor_' + key);
                                            gridEditor.classList.add((gridEditor as any).gId + '_editor');
                                            (this as any).editOldValue = cell.cValue;
                                        }
                                    }
                                }
                            });
                            break;
                    }
                    if ((this as any).doEventWithCheckChanged(cell.gId, '_onEditEnter', cell.row, cell.cId, gridEditor) === false) {
                        return;
                    }
                    if (!gridEditor) return;
                    cell.style.padding = '0';
                    cell.style.fontSize = '0px'; 
                    cell.appendChild(gridEditor);
                    
                    gridEditor.focus();
                    if (isEnterKey) gridEditor.select();
                    (this as any).activeGridEditor = gridEditor;
                    (this as any).doEventWithCheckChanged(cell.gId, '_onEditEnter', cell.row, cell.cId, gridEditor);
                },
                getValidValue (cell: Cell, value: any): any {
                    const nullValue = (this as any).nvl((this as any)[cell.gId].info.gNullValue, null);
                    if (!cell) return null;
                    if (cell.cDataType !== 'code') {
                        if (value === undefined || value === null || value === '') return nullValue;
                        if (value === nullValue) return nullValue;
                    }

                    switch (cell.cDataType) {
                        case 'text':
                            if (cell.cMaxLength) {
                                value = value.substring(0, cell.cMaxLength);
                            }
                            if (cell.cMaxByte) {
                                value = (this as any).getCutByteLength(value, cell.cMaxByte);
                            }
                            return value;
                        case 'mask':
                            return (this as any).nvl((this as any).getMaskValue(cell.cFormat, value), nullValue);
                        case 'date':
                            return (this as any).nvl((this as any).getDateWithValueDateFormat(value), nullValue);
                        case 'month':
                            return (this as any).nvl((this as any).getDateWithValueMonthFormat(value), nullValue);
                        case 'number':
                            value = (this as any).getOnlyNumberWithNaNToNull(value);
                            if(value === null) return nullValue

                            const max = cell.cMaxNumber;
                            const min = cell.cMinNumber;
                            const dp = cell.cRoundNumber;

                            if (max !== null && max !== undefined && typeof max === 'number' && value > max) {
                                value = max;
                            }
                            if (min !== null && min !== undefined && typeof min === 'number' && value < min) {
                                value = min;
                            }
                            let number = parseFloat(value);
                            if (dp === null || dp === undefined || typeof dp !== 'number') {
                                return Number(value);
                            } else if (dp >= 0) {
                                let formattedValue = number.toFixed(dp);
                                formattedValue = formattedValue.replace(/(\.[0-9]*?)0+$/, '$1'); 
                                formattedValue = formattedValue.replace(/\.$/, ''); 
                                return Number(formattedValue);
                            } else {
                                const factor = Math.pow(10, -dp);
                                return Number((Math.round(number / factor) * factor).toFixed(-dp));
                            }
                        case 'select':
                            return value;
                        case 'checkbox':
                            if (typeof value === 'boolean') return value;
                            const checkedValue = (this as any)[cell.gId].info.gCheckedValue;
                            return checkedValue === value;
                        case 'button':
                            return value;
                        case 'link':
                            return value;
                        case 'code':
                            return (this as any).getCodeValue(cell.cCodes, cell.cDefaultCode, value);
                        default:
                            if(vg.dataType) {
                                Object.keys(vg.dataType).forEach((key) => {
                                    if(cell.cDataType === key) {
                                        if(vg.dataType[key].getValue) {
                                            if(typeof vg.dataType[key].getValue !== 'function') throw new Error('getValue must be a function.');
                                            value = vg.dataType[key].getValue(value);
                                        }
                                    }
                                });
                            }
                            return value;
                    }
                },
                getCellText (cell: Cell): string {
                    if (!cell) return '';
                    let cellText: any = '';
                    const _grid = (this as any)[cell.gId];
                    let value = (this as any).nvl(cell.cValue, _grid.info.gNullValue);
                    switch (cell.cDataType) {
                        case 'number':
                            if(value === _grid.info.gNullValue) cellText = value;
                            else cellText = utils.nvl((this as any).getFormatNumberFromCell(cell), _grid.info.gNullValue);
                            break;
                        case 'date':
                            if(value === _grid.info.gNullValue) cellText = value;
                            else cellText = utils.nvl((this as any).getDateWithGridDateFormat(cell), _grid.info.gNullValue);
                            break;
                        case 'month':
                            if(value === _grid.info.gNullValue) cellText = value;
                            else cellText = utils.nvl((this as any).getDateWithGridMonthFormat(cell), _grid.info.gNullValue);
                            break;
                        case 'select':
                            if (Array.isArray(cell.cValue) && cell.cValue.length > 0) {
                                cellText = cell.cValue[0].text;
                                for(const option of cell.cValue) {
                                    if (option.selected) cellText = option.text;
                                }
                                if(cellText === null || cellText === undefined) cellText = _grid.info.gNullValue;
                            }
                            break;
                        case 'link':
                            cellText = cell.cValue && cell.cValue.text ? cell.cValue.text : value;
                            break;
                        default:
                            cellText = value;
                            if(vg.dataType) {
                                Object.keys(vg.dataType).forEach((key) => {
                                    if(cell.cDataType === key) {
                                        if(vg.dataType[key].getText) {
                                            if(typeof vg.dataType[key].getText !== 'function') throw new Error('getText must be a function.');
                                            cellText = vg.dataType[key].getText(cellText);
                                        }
                                    }
                                });
                            }
                            else {
                                cellText = String(value);
                            }
                            break;
                    }
                    return cellText;
                },
                selectAndCheckboxOnChange (target: any) {
                    if (!target.nType) return;
                    const cell = target.parentNode;
                    let beforeEventResult = true;
                    if (target.nType === 'select') utils.editNewValue = target.value;
                    else if (target.nType === 'checkbox') utils.editNewValue = target.checked ? (utils as any)[target.parentNode.gId].info.gCheckedValue : (utils as any)[target.parentNode.gId].info.gUncheckedValue;
                    if ((this as any).doEventWithCheckChanged(cell.gId, '_onBeforeChange', cell.row, cell.cId, utils.editOldValue, utils.editNewValue) === false) {
                        beforeEventResult = false;
                    }
                    if (!beforeEventResult || cell.cUntarget || cell.cLocked) {
                        switch (target.nType) {
                            case 'select':
                                target.value = utils.editOldValue;
                                break;                    
                            case 'checkbox':
                                target.checked = !target.checked;
                                break;
                            default:
                                break;                    
                        }
                        utils.editOldValue = null;
                        return false;
                    }
                    switch (target.nType) {
                        case 'select':
                            
                            utils.recodeGridModify(cell.gId, utils.getRecodesWithModifyValue(cell, utils.getSelectOptions(target)));
                            break;
                        case 'checkbox':
                            
                            utils.recodeGridModify(cell.gId, utils.getRecodesWithModifyValue(cell, utils.editNewValue));
                            break;
                        default:
                            break;
                    }
                    (this as any).doEventWithCheckChanged(cell.gId, '_onAfterChange', cell.row, cell.cId, utils.editOldValue, utils.editNewValue);
                },
                getFormatNumber (format: string, value: any): string | number {
                    const regex = /^(.*?)([#0,.]+)(.*?)$/;
                    if(!format || value === null || value === undefined) return Number(value);
                    const matches = format.match(regex);
                    if (!matches) return Number(value);

                    const getToNumber = (val: any) => {
                        if (isNaN(val) || !isFinite(val)) {
                            return 0;
                        }
                        return Number(val);
                    }
                    const getToFloat = (val: any) => {
                        if (isNaN(val) || !isFinite(val)) {
                            return 0;
                        }
                        return parseFloat(val);
                    }

                    const prefix = matches[1];
                    const numberFormat = matches[2];
                    const suffix = matches[3];
                    const integerFormat = numberFormat.split('.')[0];
                    const decimalFormat = numberFormat.split('.').length > 1 ? numberFormat.split('.')[1] : '';

                    if(suffix === '%' || suffix === ' %') value = value * 100;

                    let numStr = String(value);
                    const isNegative = numStr[0] === '-';
                    numStr = isNegative ? numStr.substring(1) : numStr;
                    let integer = numStr.split('.')[0];
                    let decimal = numStr.split('.').length > 1 ? numStr.split('.')[1] : '';
                    
                    let result;

                    decimal = getToFloat('0.' + decimal)
                            .toLocaleString('en',{
                                minimumFractionDigits: decimalFormat.lastIndexOf('0') + 1,
                                maximumFractionDigits: decimalFormat.length
                                });
                    if(decimal === '0') decimal = '';
                    else decimal = decimal.substring(1);

                    switch (integerFormat) {
                        case '#,###':
                            if(getToNumber(integer) === 0) {
                                result = decimal;
                            }
                            else {
                                integer = getToFloat(integer).toLocaleString('en');
                                result = integer + decimal;
                            }
                            break;
                        case '#,##0':
                            integer = getToFloat(integer).toLocaleString('en');
                            result = integer + decimal;
                            break;
                        case '#':
                            if(getToNumber(integer) === 0) {
                                result = decimal;
                            }
                            else {
                                result = integer + decimal;
                            }
                            break;
                        case '0':
                            result = integer + decimal;
                            break;
                        default:
                            return value;
                    }
                    result = isNegative ? '-' + result : result;
                    return prefix + result + suffix;
                },
                getFormatNumberFromCell (cell: Cell): string | null {
                    if(!cell.cFormat) return cell.cValue;
                    if(cell.cValue === null || cell.cValue === undefined) return null;
                    return (this as any).getFormatNumber(cell.cFormat, cell.cValue);
                },
                getDateWithValueDateFormat(dateStr: string): string | null {
                    if(!dateStr || typeof dateStr !== 'string') return null;
                    
                    const pattern = /^(\d{4})[-/.]? ?(\d{2})[-/.]? ?(\d{2})$/;
                    const match = pattern.exec(dateStr.replace(/\s+/g, ''));
                    if (!match) {
                        return null;
                    }
                    
                    const year = match[1];
                    const month = match[2];
                    const day = match[3];
                    if (!(this as any).isValidDate(year, month, day)) {
                        return null;
                    }
                    return `${year}${month}${day}`;
                },
                getDateWithValueMonthFormat(dateStr: string): string | null {
                    if(!dateStr || typeof dateStr !== 'string') return null;
                    
                    const patternYMD = /^(\d{4})[-/.]? ?(\d{2})[-/.]? ?(\d{2})?$/;  
                    const patternYM = /^(\d{4})[-/.]? ?(\d{2})$/;

                    
                    dateStr = dateStr.replace(/\s+/g, '');

                    const matchYMD = patternYMD.exec(dateStr);
                    const matchYM = patternYM.exec(dateStr);

                    let year, month;
                    if (matchYMD) {
                        year = matchYMD[1];
                        month = matchYMD[2];
                    }
                    else if (matchYM) {
                        year = matchYM[1];
                        month = matchYM[2];
                    }
                    else {
                        return null;
                    }
                    if (!(this as any).isValidDate(year, month, '01')) {
                        return null;
                    }
                    return `${year}${month}`;
                },
                getDateWithInputDateFormat (dateStr: string): string | null {
                    if(!dateStr || typeof dateStr !== 'string') return null;
                    
                    const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
                    const match = pattern.exec(dateStr);
                    if (!match) {
                        return null;
                    }
                    
                    const year = match[1];
                    const month = match[2];
                    const day = match[3];
                    if (!(this as any).isValidDate(year, month, day)) {
                        return null;
                    }
                    return `${year}-${month}-${day}`;
                },
                getDateWithInputMonthFormat (dateStr: string): string | null {
                    if(!dateStr || typeof dateStr !== 'string') return null;
                    
                    const pattern = /^(\d{4})[-/.]?(\d{2})$/;
                    const match = pattern.exec(dateStr);
                    if (!match) {
                        return null;
                    }
                    
                    const year = match[1];
                    const month = match[2];
                    if (!(this as any).isValidDate(year, month, '01')) {
                        return null;
                    }
                    return `${year}-${month}`;
                },
                getDateWithGridDateFormat (cell: Cell): string | null {
                    const pattern = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})$/;
                    const match = pattern.exec(cell.cValue);
                    
                    if (!match) {
                        return null;
                    }
                    const year = match[1];
                    const month = match[2];
                    const day = match[3];
                    if (!(this as any).isValidDate(year, month, day)) {
                        return null;
                    }
                    const dateFormat = (this as any)[cell.gId].info.gDateFormat;
                    
                    switch (dateFormat) {
                        case 'yyyy-mm-dd':
                            return `${year}-${month}-${day}`;
                        case 'yyyy/mm/dd':
                            return `${year}/${month}/${day}`;
                        case 'yyyy. mm. dd':
                            return `${year}. ${month}. ${day}`;
                        case 'yyyymmdd':
                            return `${year}${month}${day}`;

                        case 'mm-dd-yyyy':
                            return `${month}-${day}-${year}`;
                        case 'mm/dd/yyyy':
                            return `${month}/${day}/${year}`;
                        case 'mm. dd. yyyy':
                            return `${month}. ${day}. ${year}`;
                        case 'mmddyyyy':
                            return `${month}${day}${year}`;

                        case 'dd-mm-yyyy':
                            return `${day}-${month}-${year}`;
                        case 'dd/mm/yyyy':
                            return `${day}/${month}/${year}`;
                        case 'dd. mm. yyyy':
                            return `${day}. ${month}. ${year}`;
                        case 'ddmmyyyy':
                            return `${day}${month}${year}`;
                        default:
                            return `${year}-${month}-${day}`;
                    }
                },
                getDateWithGridMonthFormat (cell: Cell): string | null {
                    const pattern = /^(\d{4})[-/.]?(\d{2})$/;
                    const match = pattern.exec(cell.cValue);
                    
                    if (!match) {
                        return null;
                    }
                    const year = match[1];
                    const month = match[2];
                    if (!(this as any).isValidDate(year, month, '01')) {
                        return null;
                    }
                    const monthFormat = (this as any)[cell.gId].info.gMonthFormat;
                    
                    switch (monthFormat) {
                        case 'yyyy-mm':
                            return `${year}-${month}`;
                        case 'yyyy/mm':
                            return `${year}/${month}`;
                        case 'yyyy. mm':
                            return `${year}. ${month}`;
                        case 'yyyymm':
                            return `${year}${month}`;

                        case 'mm-yyyy':
                            return `${month}-${year}`;
                        case 'mm/yyyy':
                            return `${month}/${year}`;
                        case 'mm. yyyy':
                            return `${month}. ${year}`;
                        case 'mmyyyy':
                            return `${month}${year}`;
                        default:
                            return `${year}-${month}`;
                    }
                },
                getCodeValue (code: string[], defaultCode: string | null, value: string): string | null {
                    if (!code || !Array.isArray(code)) return defaultCode;
                    if (code.indexOf(value) >= 0) return value;
                    return defaultCode;
                },
                getMaskValue (format: string, value: string): string | null {
                    if(typeof format !== 'string') return null;
                    if(typeof value !== 'string') return null;
                    const formatArr = format.split('');
                    const valueArr = value.split('');
                    let lastValue = '';
                    let isValid;
                    formatArr.every((formatPiece, idx) => {
                        isValid = false;
                        switch (formatPiece) {
                            case 'A':
                                if (/^[A-Z]$/.test(valueArr[idx])) {
                                    lastValue += valueArr[idx];
                                    isValid = true;
                                }
                                else if (/^[a-z]$/.test(valueArr[idx])) {
                                    lastValue += utils.toUpperCase(valueArr[idx]);
                                    isValid = true;
                                }
                                break;
                            case 'a':
                                if (/^[a-z]$/.test(valueArr[idx])) {
                                    lastValue += valueArr[idx];
                                    isValid = true;
                                }
                                else if (/^[A-Z]$/.test(valueArr[idx])) {
                                    lastValue += utils.toLowerCase(valueArr[idx]);
                                    isValid = true;
                                }
                                break;
                            case '9':
                                if (/^[0-9]$/.test(valueArr[idx])) {
                                    lastValue += valueArr[idx];
                                    isValid = true;
                                }
                                break;
                            default:
                                if (formatPiece === valueArr[idx]) {
                                    lastValue += valueArr[idx];
                                    isValid = true;
                                }
                                break;
                        }
                        return isValid;
                    })
                    return lastValue;
                },
                setSelectOptions (select: any, options: any) {
                    if (!Array.isArray(options)) return;
                    (this as any).removeAllChild(select);
                    options.forEach((opt) => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        if (opt.selected) option.setAttribute('selected', '');
                        if (opt.disabled) option.setAttribute('disabled', '');
                        if (opt.label) option.setAttribute('label', opt.label);
                        select.appendChild(option); 
                    });
                },
                getSelectOptions (select: any) {
                    if (!select) return null;
                    const options = select.options;
                    if (!options) return null;
                    const returnOptions = [];
                    for(const option of options) {
                        let returnOption = {
                            value : option.value,
                            text : option.textContent
                        };
                        if (option.selected) (returnOption as any).selected = true;
                        if (option.disabled) (returnOption as any).disabled = true;
                        if (option.label) (returnOption as any).label = option.label;
                        returnOptions.push(returnOption);
                    }
                    return returnOptions.length === 0 ? null : returnOptions;
                },
                doEventWithCheckChanged (gId: string, eventName: string, ...params: any[]) {
                    if ((this as any)[gId].events[gId + eventName] !== (window as any)[gId + eventName]) throw new Error('Abnormal access has been detected. An initially defined event has changed. \nevent : ' + gId + eventName);
                    return (window as any)[gId + eventName](...params);
                },
            }
            const enumWidthUnit = Object.freeze({
                PIXEL: 'px',
                PERCENT: '%',
            });
            const dataTypeUnit = {
                TEXT: 'text',
                NUMBER: 'number',
                DATE: 'date',
                MONTH: 'month',
                MASK: 'mask',
                SELECT : 'select',
                CHECKBOX : 'checkbox',
                BUTTON : 'button',
                LINK : 'link',
                CODE : 'code',
            };
            if(vg.dataType) {
                Object.keys(vg.dataType).forEach((key) => {
                    (dataTypeUnit as any)[utils.toUpperCase(key)] = key;
                });
            }
            Object.freeze(dataTypeUnit);
            const alignUnit = Object.freeze({
                LEFT: 'left',
                CENTER: 'center',
                RIGHT: 'right',
            });
            const verticalAlignUnit = Object.freeze({
                TOP: 'top',
                CENTER: 'center',
                BOTTOM: 'bottom',
            });
            const footerUnit = Object.freeze({
                MAX: '$$MAX',
                MIN: '$$MIN',
                SUM: '$$SUM',
                AVG: '$$AVG',
            });
            const statusUnit = Object.freeze({
                CREATE: 'C',
                UPDATE: 'U',
                DELETE: 'D',
            });
            const selectionPolicyUnit = Object.freeze({
                SINGLE: 'single',
                RANGE: 'range',
                NONE: 'none',
            });

            let gridIndex = 1;
            for(const vanillagrid of vanillagrids) {
                const gridHeaderCells: Cell[][] = [];
                const gridFooterCells: Cell[][] = [];
                const gridBodyCells: Cell[][] = [];
                let tempGridData: Cell, tempRows: Cell[];
                const colInfos: CellColInfo[] = [];
                let colCount = 0;
                
                const gId = utils.getAttributeWithCheckRequired('id', vanillagrid);
                if(!gId) throw new Error('Please insert id attribute in vanillgrid div');
                vanillagrid.classList.add(gId + '_vanillagrid');
                
                const grid = document.createElement('v-g') as any;
                grid.gId = gId;
                grid.info = {
                    gIndex : gridIndex,
                    gType : 'g',
                    gName : utils.nvl(vanillagrid.getAttribute('name'), gId) as string,
                    gLocked : utils.nvl(utils.getAttributeOnlyBoolean('locked', vanillagrid), vg.defaultGridInfo.locked),
                    gLockedColor : utils.nvl(utils.getAttributeOnlyBoolean('locked-color', vanillagrid), vg.defaultGridInfo.lockedColor),
                    gResizable : utils.nvl(utils.getAttributeOnlyBoolean('resizable', vanillagrid), vg.defaultGridInfo.resizable),
                    gRedoable : utils.nvl(utils.getAttributeOnlyBoolean('redoable', vanillagrid), vg.defaultGridInfo.redoable),
                    gRedoCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('redo-count', vanillagrid), vg.defaultGridInfo.redoCount),
                    gVisible : utils.nvl(utils.getAttributeOnlyBoolean('visible', vanillagrid), vg.defaultGridInfo.visible),
                    gHeaderVisible : utils.nvl(utils.getAttributeOnlyBoolean('header-visible', vanillagrid), vg.defaultGridInfo.headerVisible),
                    gRownumVisible : utils.nvl(utils.getAttributeOnlyBoolean('rownum-visible', vanillagrid), vg.defaultGridInfo.rownumVisible),
                    gRownumSize : utils.nvl(vanillagrid.getAttribute('rownum-size'), vg.defaultGridInfo.rownumSize),
                    gStatusVisible : utils.nvl(utils.getAttributeOnlyBoolean('status-visible', vanillagrid), vg.defaultGridInfo.statusVisible),
                    gSelectionPolicy : utils.nvl((utils.isIncludeEnum(selectionPolicyUnit, utils.toLowerCase(vanillagrid.getAttribute('selection-policy'))) ? utils.toLowerCase(vanillagrid.getAttribute('selectionPolicy')) : ''), vg.defaultGridInfo.selectionPolicy),
                    gNullValue : utils.nvl(vanillagrid.getAttribute('null-value'), vg.defaultGridInfo.nullValue),
                    gDateFormat : utils.nvl(vanillagrid.getAttribute('date-format'), vg.defaultGridInfo.dateFormat),
                    gMonthFormat : utils.nvl(vanillagrid.getAttribute('month-format'), vg.defaultGridInfo.monthFormat),
                    gAlterRow : utils.nvl(utils.getAttributeOnlyBoolean('alter-row', vanillagrid), vg.defaultGridInfo.alterRow),
                    gFrozenColCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('frozen-col-count', vanillagrid), vg.defaultGridInfo.frozenColCount),
                    gFrozenRowCount : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('frozen-row-count', vanillagrid), vg.defaultGridInfo.frozenRowCount),
                    gSortable : utils.nvl(utils.getAttributeOnlyBoolean('sortable', vanillagrid), vg.defaultGridInfo.sortable),
                    gFilterable : utils.nvl(utils.getAttributeOnlyBoolean('filterable', vanillagrid), vg.defaultGridInfo.filterable),
                    gAllCheckable : utils.nvl(utils.getAttributeOnlyBoolean('all-checkable', vanillagrid), vg.defaultGridInfo.allCheckable),
                    gCheckedValue : utils.nvl(vanillagrid.getAttribute('checked-value'), vg.defaultGridInfo.checkedValue),
                    gUncheckedValue : utils.nvl(vanillagrid.getAttribute('unchecked-value'), vg.defaultGridInfo.uncheckedValue),
                    gRownumLockedColor : null,
                    gStatusLockedColor : null,
                }
                gridIndex++;
                grid.info.gRownumLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('rownum-locked-color', vanillagrid), grid.info.gLocked);
                grid.info.gStatusLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('status-locked-color', vanillagrid), grid.info.gLocked);
                if (grid.info.gCheckedValue === grid.info.gUncheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
                
                grid.cssInfo = {
                    width : utils.nvl(vanillagrid.getAttribute('width'), vg.defaultGridCssInfo.width),
                    height : utils.nvl(vanillagrid.getAttribute('height'), vg.defaultGridCssInfo.height),
                    margin : utils.nvl(vanillagrid.getAttribute('margin'), vg.defaultGridCssInfo.margin),
                    padding : utils.nvl(vanillagrid.getAttribute('padding'), vg.defaultGridCssInfo.padding),
                    sizeLevel : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('size-level', vanillagrid), vg.defaultGridCssInfo.sizeLevel),
                    verticalAlign : utils.nvl((utils.isIncludeEnum(verticalAlignUnit, utils.toLowerCase(vanillagrid.getAttribute('vertical-align'))) ? utils.toLowerCase(vanillagrid.getAttribute('vertical-align')) : ''), vg.defaultGridCssInfo.verticalAlign),
                    horizenBorderSize : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('horizen-border-size', vanillagrid), vg.defaultGridCssInfo.horizenBorderSize),
                    verticalBorderSize : utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('vertical-border-size', vanillagrid), vg.defaultGridCssInfo.verticalBorderSize),
                    gridFontFamily : utils.nvl(vanillagrid.getAttribute('grid-font-family'), vg.defaultGridCssInfo.gridFontFamily),
                    editorFontFamily : utils.nvl(vanillagrid.getAttribute('editor-font-family'), vg.defaultGridCssInfo.editorFontFamily),
                    color : utils.nvl(vanillagrid.getAttribute('color'), vg.defaultGridCssInfo.color),
                    colorSet : utils.nvl(vanillagrid.getAttribute('color-set'), vg.defaultGridCssInfo.colorSet),
                    overflowWrap : utils.nvl(vanillagrid.getAttribute('overflow-wrap'), vg.defaultGridCssInfo.overflowWrap),
                    wordBreak : utils.nvl(vanillagrid.getAttribute('word-break'), vg.defaultGridCssInfo.wordBreak),
                    whiteSpace : utils.nvl(vanillagrid.getAttribute('white-space'), vg.defaultGridCssInfo.whiteSpace),
                    linkHasUnderLine : utils.nvl(utils.getAttributeOnlyBoolean('link-has-under-line', vanillagrid), vg.defaultGridCssInfo.linkHasUnderLine),
                    invertColor : utils.nvl(utils.getAttributeOnlyBoolean('invert-color', vanillagrid), vg.defaultGridCssInfo.invertColor),
                    gridBorderColor : utils.nvl(vanillagrid.getAttribute('grid-border-color'), vg.defaultGridCssInfo.gridBorderColor),
                    headerCellBackColor : utils.nvl(vanillagrid.getAttribute('header-cell-back-color'), vg.defaultGridCssInfo.headerCellBackColor),
                    headerCellBorderColor : utils.nvl(vanillagrid.getAttribute('header-cell-border-color'), vg.defaultGridCssInfo.headerCellBorderColor),
                    headerCellFontColor : utils.nvl(vanillagrid.getAttribute('header-cell-font-color'), vg.defaultGridCssInfo.headerCellFontColor),
                    footerCellBackColor : utils.nvl(vanillagrid.getAttribute('footer-cell-back-color'), vg.defaultGridCssInfo.footerCellBackColor),
                    footerCellBorderColor : utils.nvl(vanillagrid.getAttribute('footer-cell-border-color'), vg.defaultGridCssInfo.footerCellBorderColor),
                    footerCellFontColor : utils.nvl(vanillagrid.getAttribute('footer-cell-font-color'), vg.defaultGridCssInfo.footerCellFontColor),
                    bodyBackColor : utils.nvl(vanillagrid.getAttribute('body-back-color'), vg.defaultGridCssInfo.bodyBackColor),
                    bodyCellBackColor : utils.nvl(vanillagrid.getAttribute('body-cell-back-color'), vg.defaultGridCssInfo.bodyCellBackColor),
                    bodyCellBorderColor : utils.nvl(vanillagrid.getAttribute('body-cell-border-color'), vg.defaultGridCssInfo.bodyCellBorderColor),
                    bodyCellFontColor : utils.nvl(vanillagrid.getAttribute('body-cell-font-color'), vg.defaultGridCssInfo.bodyCellFontColor),
                    editorBackColor : utils.nvl(vanillagrid.getAttribute('editor-back-color'), vg.defaultGridCssInfo.editorBackColor),
                    editorFontColor : utils.nvl(vanillagrid.getAttribute('editor-font-color'), vg.defaultGridCssInfo.editorFontColor),
                    selectCellBackColor : utils.nvl(vanillagrid.getAttribute('select-cell-back-color'), vg.defaultGridCssInfo.selectCellBackColor),
                    selectCellFontColor : utils.nvl(vanillagrid.getAttribute('select-cell-font-color'), vg.defaultGridCssInfo.selectCellFontColor),
                    selectColBackColor : utils.nvl(vanillagrid.getAttribute('selectCol-back-color'), vg.defaultGridCssInfo.selectColBackColor),
                    selectColFontColor : utils.nvl(vanillagrid.getAttribute('selectCol-font-color'), vg.defaultGridCssInfo.selectColFontColor),
                    selectRowBackColor : utils.nvl(vanillagrid.getAttribute('selectRow-back-color'), vg.defaultGridCssInfo.selectRowBackColor),
                    selectRowFontColor : utils.nvl(vanillagrid.getAttribute('selectRow-font-color'), vg.defaultGridCssInfo.selectRowFontColor),
                    mouseoverCellBackColor : utils.nvl(vanillagrid.getAttribute('mouseover-cell-back-color'), vg.defaultGridCssInfo.mouseoverCellBackColor),
                    mouseoverCellFontColor : utils.nvl(vanillagrid.getAttribute('mouseover-cell-font-color'), vg.defaultGridCssInfo.mouseoverCellFontColor),
                    lockCellBackColor : utils.nvl(vanillagrid.getAttribute('lock-cell-back-color'), vg.defaultGridCssInfo.lockCellBackColor),
                    lockCellFontColor : utils.nvl(vanillagrid.getAttribute('lock-cell-font-color'), vg.defaultGridCssInfo.lockCellFontColor),
                    alterRowBackColor : utils.nvl(vanillagrid.getAttribute('alter-row-back-color'), vg.defaultGridCssInfo.alterRowBackColor),
                    alterRowFontColor : utils.nvl(vanillagrid.getAttribute('alter-row-font-color'), vg.defaultGridCssInfo.alterRowFontColor),
                    buttonFontColor : utils.nvl(vanillagrid.getAttribute('button-font-color'), vg.defaultGridCssInfo.buttonFontColor),
                    buttonBorderColor : utils.nvl(vanillagrid.getAttribute('buttonBorderColor'), vg.defaultGridCssInfo.buttonBorderColor),
                    buttonBackColor : utils.nvl(vanillagrid.getAttribute('button-back-color'), vg.defaultGridCssInfo.buttonBackColor),
                    buttonHoverFontColor : utils.nvl(vanillagrid.getAttribute('buttonHover-font-color'), vg.defaultGridCssInfo.buttonHoverFontColor),
                    buttonHoverBackColor : utils.nvl(vanillagrid.getAttribute('buttonHover-back-color'), vg.defaultGridCssInfo.buttonHoverBackColor),
                    buttonActiveFontColor : utils.nvl(vanillagrid.getAttribute('buttonActive-font-color'), vg.defaultGridCssInfo.buttonActiveFontColor),
                    buttonActiveBackColor : utils.nvl(vanillagrid.getAttribute('buttonActive-back-color'), vg.defaultGridCssInfo.buttonActiveBackColor),
                    linkFontColor : utils.nvl(vanillagrid.getAttribute('link-font-color'), vg.defaultGridCssInfo.linkFontColor),
                    linkHoverFontColor : utils.nvl(vanillagrid.getAttribute('linkHover-font-color'), vg.defaultGridCssInfo.linkHoverFontColor),
                    linkActiveFontColor : utils.nvl(vanillagrid.getAttribute('linkActive-font-color'), vg.defaultGridCssInfo.linkActiveFontColor),
                    linkVisitedFontColor : utils.nvl(vanillagrid.getAttribute('linkVisited-font-color'), vg.defaultGridCssInfo.linkVisitedFontColor),
                    linkFocusFontColor : utils.nvl(vanillagrid.getAttribute('linkFocus-font-color'), vg.defaultGridCssInfo.linkFocusFontColor),
                    cellFontSize : null,
                    cellMinHeight : null,
                };
                grid.cssInfo.cellFontSize = utils.nvl(vanillagrid.getAttribute('cell-font-size'), ((grid.cssInfo.sizeLevel! + 15) / 20) * vg.defaultGridCssInfo.cellFontSize + 'px');
                grid.cssInfo.cellMinHeight = utils.nvl(vanillagrid.getAttribute('cell-min-height'), ((grid.cssInfo.sizeLevel! + 15) / 20) * vg.defaultGridCssInfo.cellMinHeight + 'px');
                if (grid.cssInfo.colorSet){
                    grid.cssInfo.color = utils.getColorFromColorSet(grid.cssInfo.colorSet);
                    utils.setColorSet(grid.cssInfo);
                }
                else {
                    utils.setColorSet(grid.cssInfo);
                }
                if (grid.cssInfo.invertColor) {
                    utils.setInvertColor(grid.cssInfo);
                }

                grid.classList.add(gId + '_v-g');
                const gridHeader: GridHeader = document.createElement('v-g-h');
                gridHeader.gId = gId;
                gridHeader.gType = 'gh';
                gridHeader.classList.add(gId + '_v-g-h');
                const gridBody: GridBody = document.createElement('v-g-b');
                gridBody.gId = gId;
                gridBody.gType = 'gb';
                gridBody.classList.add(gId + '_v-g-b');
                const gridFooter: GridFooter = document.createElement('v-g-f');
                gridFooter.gId = gId;
                gridFooter.gType = 'gf';
                gridFooter.classList.add(gId + '_v-g-f');

                let headerRowCount = 1;
                let styleWidth;
                let footerRowCount = 0;
                Array.from(vanillagrid.querySelectorAll('v-col')).forEach(col => {
                    let headers = col.getAttribute('header');
                    if (!headers) headers = col.getAttribute('id')
                    
                    headerRowCount = headerRowCount > headers!.split(';').length ? headerRowCount : headers!.split(';').length;
                    
                    if (col.getAttribute('footer')) footerRowCount = footerRowCount > col.getAttribute('footer')!.split(';').length ? footerRowCount : col.getAttribute('footer')!.split(';').length;

                    styleWidth = col.getAttribute('width') ? ' ' + col.getAttribute('width') : ' ' + vg.defaultColInfo.originWidth;
                    let unit = utils.extractNumberAndUnit(styleWidth).unit;
                    if (!unit) {
                        styleWidth = styleWidth + 'px';
                        unit = 'px';
                    }
                    if (!utils.isIncludeEnum(enumWidthUnit, unit)) throw new Error('Width units can only be pixel or %.');
                    
                });
                let rownumSize = grid.info.gRownumVisible ? grid.info.gRownumSize + ' ' : '0px ';
                let statusSize = grid.info.gStatusVisible ? '60px ' : '0px ';

                let colInfo: CellColInfo ={
                    cId : 'v-g-rownum',
                    cIndex : 1,
                    cName : 'rownum',
                    cHeader : new Array(headerRowCount),
                    cUntarget : false,
                    cRowMerge : false,
                    cColMerge : false,
                    cColVisible : grid.info.gRownumVisible,
                    cRowVisible : true,
                    cRequired : false,
                    cResizable : false,
                    cSortable : false,
                    cFilterable : false,
                    cOriginWidth : rownumSize,
                    cDataType : 'text',
                    cSelectSize : null,
                    cLocked : true,
                    cLockedColor : grid.info.gRownumLockedColor,
                    cFormat : null,
                    cCodes : null,
                    cDefaultCode : null,
                    cMaxLength : null,
                    cMaxByte : null,
                    cMaxNumber : null,
                    cMinNumber : null,
                    cRoundNumber : null,
                    cFilterValues : null,
                    cFilterValue : null,
                    cFilter : false,
                    cAlign : 'center',
                    cVerticalAlign : null,
                    cOverflowWrap : null,
                    cWordBreak : null,
                    cWhiteSpace : null,
                    cBackColor : null,
                    cFontColor : null,
                    cFontBold : false,
                    cFontItalic : false,
                    cFontThruline : false,
                    cFontUnderline : false,
                    cFooter: null,
                };
                colInfo.cHeader![0] = '',
                colInfos.push(colInfo);

                colInfo = {
                    cId : 'v-g-status',
                    cIndex : 2,
                    cName : 'status',
                    cHeader : new Array(headerRowCount),
                    cUntarget : true,
                    cRowMerge : false,
                    cColMerge : false,
                    cColVisible : grid.info.gStatusVisible,
                    cRowVisible : true,
                    cRequired : false,
                    cResizable : false,
                    cSortable : false,
                    cFilterable : false,
                    cOriginWidth : statusSize,
                    cDataType : 'code',
                    cSelectSize : null,
                    cLocked : true,
                    cLockedColor : grid.info.gStatusLockedColor,
                    cFormat : null,
                    cCodes : ['C','U','D'],
                    cDefaultCode : null,
                    cMaxLength : null,
                    cMaxByte : null,
                    cMaxNumber : null,
                    cMinNumber : null,
                    cRoundNumber : null,
                    cFilterValues : null,
                    cFilterValue : null,
                    cFilter : false,
                    cAlign : 'center',
                    cVerticalAlign : null,
                    cOverflowWrap : null,
                    cWordBreak : null,
                    cWhiteSpace : null,
                    cBackColor : null,
                    cFontColor : null,
                    cFontBold : false,
                    cFontItalic : false,
                    cFontThruline : false,
                    cFontUnderline : false,
                    cFooter: null,
                };
                colInfo.cHeader![0] = 'status';
                colInfos.push(colInfo);

                colCount = 2;
                Array.from(vanillagrid.querySelectorAll('v-col') as NodeListOf<HTMLElement>).forEach(col => {
                    colCount++;
                    if (!col.getAttribute('id')) throw new Error('Column ID is required.');
                    if (colInfos.some(colInfo => colInfo.cId === col.getAttribute('id'))) throw new Error('Column ID is primary key.');
                    colInfo = {
                        cId : col.getAttribute('id')!,
                        cIndex : colCount,
                        cName : null,
                        cHeader : null,
                        cUntarget : null,
                        cRowMerge : null,
                        cColMerge : null,
                        cColVisible : null,
                        cRowVisible : null,
                        cRequired : null,
                        cResizable : null,
                        cSortable : null,
                        cFilterable : null,
                        cOriginWidth : null,
                        cDataType : null,
                        cSelectSize : null,
                        cLocked : null,
                        cLockedColor : null,
                        cFormat : null,
                        cCodes : null,
                        cDefaultCode : null,
                        cMaxLength : null,
                        cMaxByte : null,
                        cMaxNumber : null,
                        cMinNumber : null,
                        cRoundNumber : null,
                        cFilterValues : null,
                        cFilterValue : null,
                        cFilter : null,
                        cAlign : null,
                        cVerticalAlign : null,
                        cOverflowWrap : null,
                        cWordBreak : null,
                        cWhiteSpace : null,
                        cBackColor : null,
                        cFontColor : null,
                        cFontBold : null,
                        cFontItalic : null,
                        cFontThruline : null,
                        cFontUnderline : null,
                        cFooter: null,
                    };
                    colInfo.cName = utils.nvl(utils.toLowerCase(col.getAttribute('name')), colInfo.cId);

                    if (col.getAttribute('header')) {
                        colInfo.cHeader = col.getAttribute('header')!.split(';');
                        for(let i = colInfo.cHeader.length; i < headerRowCount; i++) {
                            colInfo.cHeader.push('');
                        }
                    }
                    else {
                        colInfo.cHeader = new Array(headerRowCount);
                        colInfo.cHeader[0] = colInfo.cId;
                    }
                    
                    if (col.getAttribute('footer')) {
                        colInfo.cFooter = col.getAttribute('footer')!.split(';');
                        for(let i = colInfo.cFooter.length; i < footerRowCount; i++) {
                            colInfo.cFooter.push('');
                        }
                    }
                    
                    let dataType = utils.toLowerCase(col.getAttribute('data-type'));
                    if (!dataType) dataType = vg.defaultColInfo.dataType;
                    if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
                    colInfo.cDataType = dataType;
                    colInfo.cUntarget = utils.nvl(utils.getAttributeOnlyBoolean('untarget', col), grid.info.gSelectionPolicy === 'none');
                    colInfo.cRowMerge = utils.nvl(utils.getAttributeOnlyBoolean('row-merge', col), vg.defaultColInfo.rowMerge);
                    colInfo.cColMerge = utils.nvl(utils.getAttributeOnlyBoolean('col-merge', col), vg.defaultColInfo.colMerge);
                    colInfo.cColVisible = utils.nvl(utils.getAttributeOnlyBoolean('visible', col), vg.defaultColInfo.colVisible);
                    colInfo.cRowVisible = true;
                    colInfo.cRequired = utils.nvl(utils.getAttributeOnlyBoolean('required', col), vg.defaultColInfo.required);
                    colInfo.cResizable = utils.nvl(utils.getAttributeOnlyBoolean('resizable', col), vg.defaultColInfo.resizable);
                    colInfo.cSortable = utils.nvl(utils.getAttributeOnlyBoolean('sortable', col), vg.defaultColInfo.sortable);
                    colInfo.cFilterable = utils.nvl(utils.getAttributeOnlyBoolean('filterable', col), vg.defaultColInfo.filterable);
                    if (colInfo.cDataType === 'checkbox') colInfo.cSortable = false;
                    styleWidth = col.getAttribute('width') ? col.getAttribute('width') : vg.defaultColInfo.originWidth;
                    if (!utils.extractNumberAndUnit(styleWidth).unit) {
                        styleWidth = styleWidth + 'px';
                    }
                    colInfo.cOriginWidth = styleWidth;
                    colInfo.cSelectSize = utils.nvl((utils.isIncludeEnum(enumWidthUnit, utils.extractNumberAndUnit(col.getAttribute('select-size')).unit) ? col.getAttribute('select-size') : ''), vg.defaultColInfo.selectSize);
                    colInfo.cLocked = utils.nvl(utils.getAttributeOnlyBoolean('locked', col), grid.info.gLocked);
                    colInfo.cLockedColor = utils.nvl(utils.getAttributeOnlyBoolean('locked-color', col), grid.info.gLockedColor);
                    colInfo.cFormat = utils.nvl(col.getAttribute('format'), vg.defaultColInfo.format);
                    colInfo.cCodes = col.getAttribute('codes') ? col.getAttribute('codes')!.split(';') : vg.defaultColInfo.codes;
                    colInfo.cDefaultCode = utils.nvl(col.getAttribute('default-code'), vg.defaultColInfo.defaultCode);
                    colInfo.cMaxLength = utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('max-length', col), vg.defaultColInfo.maxLength);
                    colInfo.cMaxByte = utils.nvl(utils.getAttributeOnlyNumberIntegerOrZero('max-byte', col), vg.defaultColInfo.maxByte);
                    colInfo.cMaxNumber = utils.nvl(utils.getAttributeOnlyNumber('max-number', col), vg.defaultColInfo.maxNumber);
                    colInfo.cMinNumber = utils.nvl(utils.getAttributeOnlyNumber('min-number', col), vg.defaultColInfo.minNumber);
                    colInfo.cRoundNumber = utils.nvl(utils.getAttributeOnlyNumberInteger('round-number', col), vg.defaultColInfo.roundNumber);

                    colInfo.cFilterValues = new Set();
                    colInfo.cFilterValue = colInfo.cFilterable ? '$$ALL' : null;
                    colInfo.cFilter = false;

                    colInfo.cAlign = utils.nvl((utils.isIncludeEnum(alignUnit, utils.toLowerCase(col.getAttribute('align'))) ? utils.toLowerCase(col.getAttribute('align')) : ''), vg.defaultColInfo.align);
                    colInfo.cVerticalAlign = utils.nvl((utils.isIncludeEnum(verticalAlignUnit, utils.toLowerCase(col.getAttribute('vertical-align'))) ? utils.toLowerCase(col.getAttribute('vertical-align')) : ''), vg.defaultColInfo.verticalAlign);
                    colInfo.cOverflowWrap = utils.nvl(col.getAttribute('overflow-wrap'), vg.defaultColInfo.overflowWrap);
                    colInfo.cWordBreak = utils.nvl(col.getAttribute('word-break'), vg.defaultColInfo.wordBreak);
                    colInfo.cWhiteSpace = utils.nvl(col.getAttribute('white-space'), vg.defaultColInfo.whiteSpace);
                    colInfo.cBackColor = utils.nvl(utils.toLowerCase(col.getAttribute('back-color')), vg.defaultColInfo.backColor);
                    colInfo.cFontColor = utils.nvl(utils.toLowerCase(col.getAttribute('font-color')), vg.defaultColInfo.fontColor);
                    colInfo.cFontBold = utils.nvl(utils.getAttributeOnlyBoolean('font-bold', col), vg.defaultColInfo.fontBold);
                    colInfo.cFontItalic = utils.nvl(utils.getAttributeOnlyBoolean('font-italic', col), vg.defaultColInfo.fontItalic);
                    colInfo.cFontThruline = utils.nvl(utils.getAttributeOnlyBoolean('font-thruline', col), vg.defaultColInfo.fontThruline);
                    colInfo.cFontUnderline = utils.nvl(utils.getAttributeOnlyBoolean('font-underline', col), vg.defaultColInfo.fontUnderline);
                    
                    colInfos.push(colInfo);
                    vanillagrid.removeChild(col);
                });
                grid.__getDefaultColInfo = (newColInfo: ColInfo, isAdd = false): CellColInfo => {
                    if (!newColInfo || !newColInfo.id) throw new Error('Column ID is required.');
                    if (isAdd) {
                        for(const colInfo of colInfos) {
                            if (newColInfo.id === colInfo.cId)  throw new Error('Column ID is primary key.');
                        }
                    }

                    const resultnewColInfo: CellColInfo = {
                        cId: newColInfo.id,
                        cName : newColInfo.name ? newColInfo.name : newColInfo.id,
                        cIndex : null,
                        cHeader : null,
                        cFooter : null,
                        cFilterValue : null,

                        cUntarget : newColInfo.untarget ?  newColInfo.untarget : grid.info.gSelectionPolicy === 'none',
                        cRowMerge : newColInfo.rowMerge ?  newColInfo.rowMerge : vg.defaultColInfo.rowMerge,
                        cColMerge : newColInfo.colMerge ?  newColInfo.colMerge : vg.defaultColInfo.colMerge,
                        cColVisible : newColInfo.colVisible ?  newColInfo.colVisible : vg.defaultColInfo.colVisible,
                        cRequired : newColInfo.required ?  newColInfo.required : vg.defaultColInfo.required,
                        cResizable : newColInfo.resizable ?  newColInfo.resizable : vg.defaultColInfo.resizable,
                        cSortable : newColInfo.sortable ?  newColInfo.sortable : vg.defaultColInfo.sortable,
                        cFilterable : newColInfo.filterable ?  newColInfo.filterable : vg.defaultColInfo.filterable,
                        cOriginWidth : newColInfo.originWidth ?  newColInfo.originWidth : vg.defaultColInfo.originWidth,
                        cDataType : newColInfo.dataType ?  newColInfo.dataType : vg.defaultColInfo.dataType,
                        cSelectSize : newColInfo.selectSize ?  newColInfo.selectSize : vg.defaultColInfo.selectSize,
                        cLocked : newColInfo.locked ?  newColInfo.locked : grid.info.gLocked,
                        cLockedColor : newColInfo.lockedColor ?  newColInfo.lockedColor : grid.info.gLockedColor,
                        cFormat : newColInfo.format ?  newColInfo.format : vg.defaultColInfo.format,
                        cCodes : newColInfo.codes ?  newColInfo.codes : vg.defaultColInfo.codes,
                        cDefaultCode : newColInfo.defaultCode ?  newColInfo.defaultCode : vg.defaultColInfo.defaultCode,
                        cMaxLength : newColInfo.maxLength ?  newColInfo.maxLength : vg.defaultColInfo.maxLength,
                        cMaxByte : newColInfo.maxByte ?  newColInfo.maxByte : vg.defaultColInfo.maxByte,
                        cMaxNumber : newColInfo.maxNumber ?  newColInfo.maxNumber : vg.defaultColInfo.maxNumber,
                        cMinNumber : newColInfo.minNumber ?  newColInfo.minNumber : vg.defaultColInfo.minNumber,
                        cRoundNumber : newColInfo.roundNumber ?  newColInfo.roundNumber : vg.defaultColInfo.roundNumber,

                        cAlign : newColInfo.align ?  newColInfo.align : vg.defaultColInfo.align,
                        cVerticalAlign : newColInfo.verticalAlign ?  newColInfo.verticalAlign : vg.defaultColInfo.verticalAlign,
                        cOverflowWrap : newColInfo.overflowWrap ?  newColInfo.overflowWrap : vg.defaultColInfo.overflowWrap,
                        cWordBreak : newColInfo.wordBreak ?  newColInfo.wordBreak : vg.defaultColInfo.wordBreak,
                        cWhiteSpace : newColInfo.whiteSpace ?  newColInfo.whiteSpace : vg.defaultColInfo.whiteSpace,
                        cBackColor : newColInfo.backColor ?  newColInfo.backColor : vg.defaultColInfo.backColor,
                        cFontColor : newColInfo.fontColor ?  newColInfo.fontColor : vg.defaultColInfo.fontColor,
                        cFontBold : newColInfo.fontBold ?  newColInfo.fontBold : vg.defaultColInfo.fontBold,
                        cFontItalic : newColInfo.fontItalic ?  newColInfo.fontItalic : vg.defaultColInfo.fontItalic,
                        cFontThruline : newColInfo.fontThruline ?  newColInfo.fontThruline : vg.defaultColInfo.fontThruline,
                        cFontUnderline : newColInfo.fontUnderline ?  newColInfo.fontUnderline : vg.defaultColInfo.fontUnderline,
                        
                        cRowVisible : true,
                        cFilterValues : new Set(),
                        cFilter : false,
                    };
                    if (newColInfo.header && (typeof newColInfo.header === 'string')) {
                        resultnewColInfo.cHeader = (newColInfo.header as string).split(';');
                    }
                    else {
                        resultnewColInfo.cHeader = new Array(grid.getHeaderRowCount());
                        resultnewColInfo.cHeader[0] = newColInfo.id;
                    }
                    if (newColInfo.footer && (typeof newColInfo.footer === 'string')) {
                        resultnewColInfo.cFooter = (newColInfo.footer as string).split(';');
                    }
                    resultnewColInfo.cFilterValue = resultnewColInfo.cFilterable ? '$$ALL' : null;
                    
                    return resultnewColInfo;
                }
                grid.__getColInfo = (colIndexOrColId: string | number, useError = false): CellColInfo | null => {
                    let returncolInfo;
                    if (typeof colIndexOrColId === 'number') {
                        returncolInfo = colInfos[colIndexOrColId - 1];
                    }
                    else {
                        for(const colInfo of colInfos) {
                            if (colInfo.cId === colIndexOrColId) {
                                returncolInfo = colInfo;
                            }
                        }
                    }
                    if (!returncolInfo) {
                        if (useError) {
                            throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
                        }
                        else {
                            return null;
                        }
                    }
                    return returncolInfo;
                };
                grid.__getColIndex = (colIndexOrColId: number | string, useError = false): number | null => {
                    if (typeof colIndexOrColId === 'number') {
                        if(useError) grid.__checkColIndex(colIndexOrColId);
                        return colIndexOrColId;
                    }
                    for(const colInfo of colInfos) {
                        if (colInfo.cId === colIndexOrColId) {
                            return colInfo.cIndex;
                        }
                    }
                    if (useError) {
                        throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
                    }
                    else {
                        return null;
                    }
                }
                grid.__setGridColSize = () => {
                    const styleGridTemplateColumnsArr = [];
                    
                    for(const colInfo of colInfos) {
                        styleGridTemplateColumnsArr.push(colInfo.cColVisible ? colInfo.cOriginWidth : '0px');
                    }
                    const styleGridTemplateColumns = styleGridTemplateColumnsArr.join(' ');
                    if (styleGridTemplateColumns.includes('%') && grid.info.gFrozenColCount !== 0) {
                        throw new Error(gId + ' has error. If you set the horizontal size to a percentage, property A is not available.');
                    }
                    gridHeader.style.gridTemplateColumns = styleGridTemplateColumns;
                    gridBody.style.gridTemplateColumns = styleGridTemplateColumns;
                    gridFooter.style.gridTemplateColumns = styleGridTemplateColumns;
                };
                grid._getCellChildNode = (cell: Cell): HTMLElement | null => {
                    if (!cell) return null;
                    let childNode: any;
                    switch (cell.cDataType) {
                        case 'text':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-text');
                            childNode.innerText = cell.cValue;
                            childNode.nType = 'text';
                            break;
                        case 'number':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-number');
                            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
                            else childNode.innerText = utils.getFormatNumberFromCell(cell);
                            childNode.nType = 'number';
                            break;
                        case 'mask':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-mask');
                            childNode.innerText = cell.cValue;
                            childNode.nType = 'mask';
                            break;
                        case 'date':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-date');
                            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
                            else childNode.innerText = utils.getDateWithGridDateFormat(cell);
                            childNode.nType = 'date';
                            break;
                        case 'month':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-month');
                            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) childNode.innerText = grid.info.gNullValue;
                            else childNode.innerText = utils.getDateWithGridMonthFormat(cell);
                            childNode.nType = 'month';
                            break;
                        case 'select':
                            if (Array.isArray(cell.cValue) && cell.cValue.length > 0) {
                                childNode = document.createElement('select');
                                childNode.classList.add(gId + '_data-value-select');
                                childNode.addEventListener('change', function (e: any) { utils.selectAndCheckboxOnChange(e.target); });
                                utils.setSelectOptions(childNode, cell.cValue);
                                childNode.nType = 'select';
                                if (cell.cSelectSize) childNode.style.width = cell.cSelectSize;
                            }
                            else {
                                childNode = document.createElement('span');
                                childNode.classList.add(gId + '_data-value-text');
                                childNode.innerText = grid.info.gNullValue;
                                childNode.nType = 'text';
                            }
                            break;
                        case 'checkbox':
                            childNode = document.createElement('input');
                            childNode.classList.add(gId + '_data-value-checkbox');
                            childNode.addEventListener('change', function (e: any) { utils.selectAndCheckboxOnChange(e.target); });
                            childNode.type = 'checkbox';
                            childNode.nType = 'checkbox';
                            if (utils.getCheckboxCellTrueOrFalse(cell)) childNode.setAttribute('checked','');
                            break;
                        case 'button':
                            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) {
                                childNode = document.createElement('span');
                                childNode.classList.add(gId + '_data-value-text');
                                childNode.innerText = grid.info.gNullValue;
                                childNode.nType = 'text';
                            }
                            else {
                                childNode = document.createElement('button');
                                childNode.classList.add(gId + '_data-value-button');
                                childNode.innerText = cell.cValue;
                                childNode.nType = 'button';
                                childNode.addEventListener('touchstart', function() {
                                    childNode.classList.add('active');
                                });
                                childNode.addEventListener('touchend', function() {
                                    childNode.classList.remove('active');
                                });
                            }
                            break;
                        case 'link':
                            if (cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue) {
                                childNode = document.createElement('span');
                                childNode.classList.add(gId + '_data-value-text');
                                childNode.innerText = grid.info.gNullValue;
                                childNode.nType = 'text';
                            }
                            else {
                                childNode = document.createElement('a');
                                childNode.classList.add(gId + '_data-value-link');
                                childNode.innerText = cell.cValue.text;
                                childNode.setAttribute('href', cell.cValue.value);
                                childNode.setAttribute('target', cell.cValue.target ? cell.cValue.target : '_blank');
                                childNode.nType = 'link';
                            }
                            break;
                        case 'code':
                            childNode = document.createElement('span');
                            childNode.classList.add(gId + '_data-value-code');
                            childNode.innerText = cell.cValue;
                            childNode.nType = 'code';
                            break;
                        default:
                            if(vg.dataType) {
                                Object.keys(vg.dataType).forEach((key) => {
                                    if(key === cell.cDataType) {
                                        if(vg.dataType[key].getChildNode) {
                                            if(typeof vg.dataType[key].getChildNode !== 'function') throw new Error('getChildNode must be a function.');
                                            childNode = vg.dataType[key].getChildNode(grid.__getData(cell));
                                            if(childNode) {
                                                if(!(childNode instanceof HTMLElement) || childNode.nodeType !== 1)  throw new Error('getChildNode must return an html element.');
                                            }
                                            else {
                                                childNode = document.createElement('span');
                                                childNode.innerText = cell.cValue;
                                            }
                                        }
                                        else {
                                            childNode = document.createElement('span');
                                            childNode.innerText = cell.cValue;
                                        }
                                        childNode.classList.add(gId + '_data-value-' + key);
                                        childNode.nType = key;
                                    }
                                });
                            }
                            break;
                    }
                    childNode.classList.add(gId + '_data-value');
                    childNode.gType = 'gbdv';
                    return childNode;
                };
                grid.__loadHeader = () => {
                    grid.__setGridColSize();
                    utils.removeAllChild(gridHeader);
                    gridHeaderCells.length = 0;

                    for(let rowCount = 1; rowCount <= grid.getHeaderRowCount(); rowCount++) {
                        tempRows = [];
                        colCount = 1;
                        for(const colInfo of colInfos) {
                            tempGridData = document.createElement('v-g-d') as any;
                            tempGridData.gId = gId;
                            tempGridData.gType = 'ghd';
                            Object.keys(colInfo).forEach(key => {
                                if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
                                    (tempGridData as any)[key] = colInfo[key as keyof CellColInfo];
                                }
                            });
                            if (Array.isArray(colInfo.cHeader)) {
                                tempGridData.cValue = colInfo.cHeader[rowCount - 1] ? colInfo.cHeader[rowCount - 1].replaceAll('\\n','\n') : '';
                            }
                            else {
                                tempGridData.cValue = colInfo.cHeader;
                            }
                            utils.setGridDataRowCol(tempGridData, rowCount, colCount);
                            if (colCount !== 1) {
                                if (!colInfo.cHeader![rowCount - 1]) { 
                                    
                                    for(let r = rowCount - 2; r >= 0; r--) {
                                        if (colInfo.cHeader![r]) tempGridData.rowMerge = true;
                                    }
                                    
                                    if (!tempGridData.rowMerge) {
                                        for(let c = colCount - 2; c >= 0; c--) {
                                            if (colInfos[c].cHeader![rowCount - 1]) tempGridData.colMerge = true;
                                        }
                                    }
                                }
                            }
                            else { 
                                if (rowCount !== 1) tempGridData.rowMerge = true;
                            }
                            tempGridData.addEventListener('mousemove', function (e: any) {
                                if (e.target.style.cursor) this.style.removeProperty('cursor');
                                if (!(utils as any)[e.target.gId] || !(utils as any)[e.target.gId].info.gResizable) return;
                                if (e.target.gType !== 'ghd') return;
                                const { left, right } = e.target.getBoundingClientRect();
                                const mouseX = e.clientX;
                                let deltaX;
                                let targetCell;
                                if (mouseX - left < 20) {
                                    if (e.target.col <= 3) return;
                                    if (e.target.frozenCol) return;
                                    for(let col = e.target.col - 1; col > 1; col--) {
                                        targetCell = (utils as any)[gId]._getHeaderCell(1, col);
                                        if (targetCell.cColVisible === true) break;
                                    }
                                    if (!targetCell.cResizable) return;

                                    e.target.style.cursor = 'ew-resize';
                                    utils.onHeaderDragging = true;

                                    if (utils.isHeaderDragging) {
                                        deltaX = mouseX - utils.mouseX;
                                        utils.modifyColSize(e.target.gId, targetCell, deltaX);
                                        utils.mouseX = mouseX;
                                    }
                                }
                                else if (right - mouseX < 20) {
                                    
                                    if (e.target.col < 3) return;
                                    if (e.target.frozenCol) return;
                                    for(let col = e.target.col; col > 1; col--) {
                                        targetCell = (utils as any)[gId]._getHeaderCell(1, col);
                                        if (targetCell.cColVisible === true) break;
                                    }
                                    if (!targetCell.cResizable) return;
                                    
                                    e.target.style.cursor = 'ew-resize';
                                    utils.onHeaderDragging = true;
                                    if (utils.isHeaderDragging) {
                                        deltaX = mouseX - utils.mouseX;
                                        utils.modifyColSize(e.target.gId, targetCell, deltaX);
                                        utils.mouseX = mouseX;
                                    }
                                } else {
                                    
                                    e.target.style.cursor = '';
                                    utils.onHeaderDragging = false;
                                }
                            });

                            tempGridData.addEventListener('mousedown', function (e) {
                                utils.mouseX = e.clientX;
                                if (utils.onHeaderDragging) {
                                    utils.isHeaderDragging = true;
                                }
                            });

                            tempRows.push(tempGridData);
                            colCount++;
                        }
                        gridHeaderCells.push(tempRows);
                    }

                    for(const row of gridHeaderCells) {
                        for(const cell of row) {
                            gridHeader.append(cell);
                        }
                    }
                }
                grid._getHeaderRow = (rowIndex: number): Cell[] => {
                    return utils.getArrayElementWithBoundCheck(gridHeaderCells, rowIndex - 1);
                };
                grid._getHeaderCell = (rowIndex: number, colIndexOrColId: number | string): Cell => {
                    if (typeof colIndexOrColId === 'number') {
                        return utils.getArrayElementWithBoundCheck(grid._getHeaderRow(rowIndex), colIndexOrColId - 1);
                    }
                    else {
                        for(const cell of grid._getHeaderRow(rowIndex)) {
                            if (cell.cId === colIndexOrColId) return cell;
                        }
                    }
                    throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
                };
                grid._getHeaderCells = () => {
                    return gridHeaderCells;
                };
                grid.getHeaderRowCount = (): number => {
                    let count = 0;
                    for(const colInfo of colInfos) {
                        if (colInfo.cHeader!.length > count) count = colInfo.cHeader!.length;
                    }
                    return count;
                };
                grid.getHeaderText = (colIndexOrColId: number | string): string => {
                    return grid.__getColInfo(colIndexOrColId, true).cHeader.join(';');
                };
                grid.setHeaderText = (colIndexOrColId: number | string, value: string): boolean => {
                    const headerTextArr = value.split(';');
                    for(let r = headerTextArr.length; r < grid.getHeaderRowCount(); r++) {
                        headerTextArr.push('');
                    }
                    for(let r = headerTextArr.length; r > grid.getHeaderRowCount(); r--) {
                        colInfos.forEach((colInfo) => {
                            colInfo.cHeader!.push('');
                        })
                    }
                    grid.__getColInfo(colIndexOrColId, true).cHeader = headerTextArr;
                    grid.__loadHeader();
                    grid.reloadFilterValue();
                    return true;
                };
                grid.__getHeaderFilter = (colIndexOrColId: number | string): any => {
                    const colIndex = grid.__getColIndex(colIndexOrColId);
                    if (!colInfos[colIndex - 1].cFilterable)  return null;
                    let headerCell;
                    let filterSelect;
                    for(let r = 1; r <= grid.getHeaderRowCount(); r++) {
                        headerCell = grid._getHeaderCell(r, colIndex);
                        if (headerCell) {
                            filterSelect = headerCell.querySelectorAll('.' + grid.gId + '_filterSelect');
                            if (filterSelect[0]) {
                                return filterSelect[0];
                            }
                        }
                    }
                    return null;
                }
                grid.reloadFilterValue = (): boolean => {
                    for(const colInfo of colInfos) {
                        grid.reloadColFilter(colInfo.cIndex);
                    }
                    return true;
                }
                grid.reloadColFilter = (colIndexOrColId: number | string): boolean => {
                    utils.reloadFilterValue(grid.gId, colIndexOrColId);
                    return true;
                }
                grid.__loadFooter = () => {
                    utils.removeAllChild(gridFooter);
                    gridFooterCells.length = 0;
                    for(let rowCount = 1; rowCount <= grid.getFooterRowCount(); rowCount++) {
                        tempRows = [];
                        colCount = 1;
                        for(colInfo of colInfos) {
                            tempGridData = document.createElement('v-g-d') as any;
                            tempGridData.gId = gId;
                            tempGridData.gType = 'gfd';
                            Object.keys(colInfo).forEach(key => {
                                if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue','cIndex'].indexOf(key) < 0) {
                                    (tempGridData as any)[key] = colInfo[key as keyof CellColInfo];
                                }
                            });
                            if (colInfo.cFooter && colInfo.cFooter[rowCount - 1]) {
                                tempGridData.cFooter = colInfo.cFooter[rowCount - 1];
                            }
                            
                            utils.setGridDataRowCol(tempGridData, rowCount, colCount);
                            tempRows.push(tempGridData);
                            colCount++;
                        }
                        gridFooterCells.push(tempRows);
                    }

                    for(const row of gridFooterCells) {
                        for(const cell of row) {
                            gridFooter.append(cell);
                        }
                    }
                }
                grid._getFooterRow = (rowIndex: number) => {
                    return utils.getArrayElementWithBoundCheck(gridFooterCells, rowIndex - 1);
                };
                grid._getFooterCell = (rowIndex: number, colIndexOrColId: number | string) => {
                    if (typeof colIndexOrColId === 'number') {
                        return utils.getArrayElementWithBoundCheck(grid._getFooterRow(rowIndex), colIndexOrColId - 1);
                    }
                    else {
                        for(const cell of grid._getFooterRow(rowIndex)) {
                            if (cell.cId === colIndexOrColId) return cell;
                        }
                    }
                    throw new Error('There is no ' + (typeof colIndexOrColId === 'number' ? colIndexOrColId + 'th' : colIndexOrColId) + ' colunm.');
                };
                grid._getFooterCells = () => {
                    return gridFooterCells;
                };
                grid.getFooterRowCount = (): number => {
                    let count = 0;
                    for(const colInfo of colInfos) {
                        if (colInfo.cFooter && colInfo.cFooter.length > count) count = colInfo.cFooter.length;
                    }
                    return count;
                };
                grid.reloadFooterValue = (): boolean => {
                    utils.reloadFooterValue(grid.gId);
                    return true;
                };
                grid.setFooterValue = (row: number, colId: number | string, value: string): boolean => {
                    const footerCell = grid._getFooterCell(row, colId);
                    footerCell.cValue = value;
                    footerCell.innerText = value;
                    return true;
                }
                grid.getFooterValue = (row: number, colId: number | string): string => {
                    return grid._getFooterCell(row, colId).cValue;
                }
                grid.setFooterFormula = (colId: number | string, formula: string): boolean => {
                    grid.__getColInfo(colId, true).cFooter = formula.split(';');
                    grid.__loadFooter();
                    return true;
                }
                grid.getFooterFormula = (colId: number | string): string | null => {
                    const footerFormulas = utils.deepCopy(grid.__getColInfo(colId, true).cFooter);
                    if (footerFormulas && Array.isArray(footerFormulas)) {
                        for(let i = 0; i < footerFormulas.length; i++) {
                            if (typeof footerFormulas[i] === 'function') footerFormulas[i] = '$$FUNC';
                        }
                        return footerFormulas.join(';');
                    }
                    return null;
                }
                grid.setFooterFunction = (row: number, colId: number | string, func: Function): boolean => {
                    const footerFormulas = grid.__getColInfo(colId, true).cFooter;
                    if (footerFormulas) {
                        utils.getArrayElementWithBoundCheck(footerFormulas, row - 1); 
                        footerFormulas[row - 1] = func;
                    }
                    else {
                        grid.__getColInfo(colId, true).cFooter = new Array(grid.getFooterRowCount()).fill('');
                        grid.__getColInfo(colId, true).cFooter[row - 1] = func;
                    }
                    grid.__loadFooter();
                    return true;
                }
                grid._getRow = (rowIndex: number) => {
                    return gridBodyCells[rowIndex - 1];
                };
                grid._getCell = (rowIndex: number, colIndexOrColId: number | string) => {
                    try {
                        if (typeof colIndexOrColId === 'number') {
                            return gridBodyCells[rowIndex - 1][colIndexOrColId - 1];
                        }
                        else {
                            for(const cell of gridBodyCells[rowIndex - 1]) {
                                if (cell.cId === colIndexOrColId) return cell;
                            }
                        }
                    } catch (error) {
                        return null;
                    }
                    return null;
                };
                grid._getCells = () => {
                    return gridBodyCells;
                };
                grid.__gridBodyCellsReConnected = () => {
                    if (!grid.variables._isDrawable) return;
                    for(const row of gridBodyCells) {
                        for(const cell of row) {
                            utils.reConnectedCallbackElement(cell);
                        }
                    }
                };
                grid.__mountGridBodyCell = () => {
                    if (!grid.variables._isDrawable) return;
                    utils.removeAllChild(gridBody);
                    for(const row of gridBodyCells) {
                        for(const cell of row) {
                            gridBody.append(cell);
                        }
                    }
                    
                    utils.reloadGridForMerge(gId);
                    
                    grid.reloadFilterValue();
                    
                    grid.reloadFooterValue();
                };
                grid.__clear = () => {
                    gridBodyCells.length = 0;
                    grid.variables._activeRows = [];
                    grid.variables._activeCols = [];
                    grid.variables._activeCells = [];
                    grid.variables._targetCell = null;
                    grid.variables._recodes = [];
                    grid.variables._recodeseq = 0;
                };
                grid.__checkRowIndex = (row: number) => {
                    row = utils.validatePositiveIntegerAndZero(row);
                    if (!row || row < 1 || row > grid.getRowCount()) throw new Error('Please insert a row of valid range.');
                }
                grid.__checkColRownumOrStatus = (colIndexOrColId: number | string) => {
                    if(typeof colIndexOrColId === 'number') {
                        if (colIndexOrColId <= 2) throw new Error('The row number or status columns info cannot be modified.');
                    }
                    else {
                        if(colIndexOrColId === 'v-g-rownum' || colIndexOrColId === 'v-g-status') throw new Error('The row number or status columns info cannot be modified.');
                    }
                }
                grid.__checkColIndex = (col: number) => {
                    col = utils.validatePositiveIntegerAndZero(col);
                    if (!col || col < 1 || col > grid.getColCount()) throw new Error('Please insert a col of valid range.');
                }
                grid.getGridInfo = (): GridInfo => {
                    const gridInfo = grid.info;
                    const resultInfo: any = {};
                    Object.keys(gridInfo).forEach(key => {
                        const dataKey = key.charAt(1).toLowerCase() + key.slice(2);
                        if (dataKey !== 'type') resultInfo[dataKey] = utils.deepCopy(gridInfo[key]);
                    });
                    resultInfo.id = gId;
                    resultInfo.cssInfo = utils.deepCopy(grid.cssInfo);
                    return resultInfo;
                };
                grid.load = (keyValueOrDatas: Record<string, any> | Record<string, any>[]): boolean => {
                    if (!keyValueOrDatas) return false;
                    if (!Array.isArray(keyValueOrDatas)) throw new Error('Please insert valid datas.');
                    
                    const isKeyValue = utils.checkIsValueOrData(keyValueOrDatas);
                    grid.__clear();

                    if (isKeyValue) {    
                        const keyValues = keyValueOrDatas;
                        for(let rowCount = 1; rowCount <= keyValues.length; rowCount++) {
                            tempRows = [];
                            const keyValue = keyValues[rowCount - 1];
                            for(let colCount = 1; colCount <= colInfos.length; colCount++) {
                                tempGridData = utils.getGridCell(gId, colInfos[colCount - 1], keyValue, rowCount, colCount);
                                tempRows.push(tempGridData);
                            }
                            gridBodyCells.push(tempRows);
                        }
                    }
                    else {
                        const datas = keyValueOrDatas;
                        for(let rowCount = 1; rowCount <= datas.length; rowCount++) {
                            tempRows = [];
                            const colDatas = datas[rowCount - 1];
                            for(let colCount = 1; colCount <= colInfos.length; colCount++) {
                                tempGridData = utils.getGridCell(gId, colInfos[colCount - 1], colDatas, rowCount, colCount);
                                tempRows.push(tempGridData);
                            }
                        gridBodyCells.push(tempRows);
                        }
                    }
                    grid.__mountGridBodyCell();
                    return true;
                };
                grid.clear = (): boolean => {
                    utils.removeAllChild(gridBody);
                    grid.variables._sortToggle = {};
                    grid.variables._filters = [];
                    grid.__clear();
                    return true;
                };
                grid.clearStatus = (): boolean => {
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, 2);
                        cell.cValue = null;
                        utils.reConnectedCallbackElement(cell);
                    }
                    return true;
                };
                grid.getRowCount = (): number => {
                    return gridBodyCells.length;
                };
                grid.getColCount = (): number => {
                    return colInfos.length;
                };
                grid.getValues = (): Record<string, any>[] => {
                    const keyValues = [];
                    let cols;
                    for(const rows of gridBodyCells) {
                        cols = {};
                        for(const cell of rows) {
                            (cols as any)[cell.cId] = utils.deepCopy(cell.cValue);
                        }
                        keyValues.push(cols);
                    }
                    return keyValues;
                };
                grid.___getDatasWithoutExceptedProperty = (exceptedProperty = []) => {
                    const datas = [];
                    let cols;
                    for(const rows of gridBodyCells) {
                        cols = [];
                        for(const cell of rows) {
                            const data = grid.__getData(cell, exceptedProperty);
                            cols.push(data);
                        }
                        datas.push(cols);
                    }
                    return datas;
                };
                grid.getDatas = (): Record<string, any>[] => {
                    return grid.___getDatasWithoutExceptedProperty();
                };
                grid.sort = (colId: string, isAsc = true, isNumSort = false): boolean => {
                    const datas = grid.getDatas();
                    const sortDatas = utils.sort(grid.gId, datas, colId, isAsc, isNumSort);
                    const sortToggle = grid.variables._sortToggle[colId];
                    grid.load(sortDatas);
                    grid.variables._sortToggle[colId] = sortToggle;
                    return true;
                };
                grid.checkRequired = (func: Function): boolean => {
                    if (func && typeof func !== 'function') throw new Error('Please insert a valid function.');
                    for(const rows of gridBodyCells) {
                        for(const cell of rows) {
                            if(cell.cRequired
                                && ['select','checkbox','button','link'].indexOf(cell.cDataType!) < 0
                                && (cell.cValue === '' || cell.cValue === null || cell.cValue === undefined || cell.cValue === grid.info.gNullValue)) {
                                if(func) {
                                    func(grid.__getData(cell));
                                }
                                else {
                                    if (!vg.checkRequiredFunction || typeof vg.checkRequiredFunction !== 'function') throw new Error('Please insert a valid checkRequired function.');
                                    vg.checkRequiredFunction(grid.__getData(cell));
                                }
                                return false;
                            }
                        }
                    }
                    return true;
                }
                grid.setGridMount = (isDrawable: boolean): boolean => {
                    isDrawable = isDrawable === true;
                    grid.variables._isDrawable = isDrawable;
                    if (isDrawable) {
                        grid.__mountGridBodyCell();        
                    }
                    return true;
                };
                grid.getGridFilter = (): Record<string, any>[] => {
                    return grid.variables._filters;
                }
                grid.setGridWidth = (cssTextWidth: string): boolean => {
                    if (!cssTextWidth) throw new Error('Please insert cssText of width.');
                    grid.cssInfo.width = cssTextWidth;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridHeight = (cssTextHeight: string): boolean => {
                    if (!cssTextHeight) throw new Error('Please insert cssText of height.');
                    grid.cssInfo.height = cssTextHeight;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridSizeLevel = (sizeLevel: number) => {
                    sizeLevel = utils.getOnlyNumberWithNaNToNull(sizeLevel)!;
                    if (!sizeLevel) throw new Error('Please insert number of size level.');
                    grid.cssInfo.sizeLevel = sizeLevel;
                    grid.cssInfo.cellFontSize = ((grid.cssInfo.sizeLevel + 15) / 20) * 14 + 'px';    
                    grid.cssInfo.cellMinHeight = ((grid.cssInfo.sizeLevel + 15) / 20) * 21 + 'px';    
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridVerticalAlign = (verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
                    if (!verticalAlign) throw new Error('Please insert vertical align.');
                    if (!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
                    const cssTextVerticalAlign = utils.getVerticalAlign(verticalAlign)
                    grid.cssInfo.verticalAlign = cssTextVerticalAlign;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setCellFontSize = (cssTextFontSize: string): boolean => {
                    if (!cssTextFontSize) throw new Error('Please insert cssText of cell font size.');
                    grid.cssInfo.cellFontSize = cssTextFontSize;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setCellMinHeight = (cssTextMinHeight: string): boolean => {
                    if (!cssTextMinHeight) throw new Error('Please insert cssText of cell min height.');
                    grid.cssInfo.cellMinHeight = cssTextMinHeight;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setHorizenBorderSize = (pxHorizenBorderSize: number): boolean => {
                    utils.validatePositiveIntegerAndZero(pxHorizenBorderSize);
                    grid.cssInfo.horizenBorderSize = pxHorizenBorderSize;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setVerticalBorderSize = (pxVerticalBorderSize: number): boolean => {
                    utils.validatePositiveIntegerAndZero(pxVerticalBorderSize);
                    grid.cssInfo.verticalBorderSize = pxVerticalBorderSize;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridColor = (cssTextHexColor: string): boolean => {
                    if (!/^#[0-9a-fA-F]{6}$/.test(cssTextHexColor)) {
                        throw new Error('Please insert valid cssText of hexadecimal color. (#ffffff)');
                    }
                    grid.cssInfo.color = cssTextHexColor;
                    utils.setColorSet(grid.cssInfo);
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridColorSet = (colorName: string): boolean => {
                    const hexColor = utils.getColorFromColorSet(colorName);
                    grid.cssInfo.color = hexColor;
                    utils.setColorSet(grid.cssInfo);
                    grid._setGridCssStyle();
                    return true;
                };
                grid.invertColor = (doInvert: boolean): boolean => {
                    doInvert = doInvert === true;
                    if (doInvert) utils.setInvertColor(grid.cssInfo);
                    else utils.setColorSet(grid.cssInfo);
                    grid._setGridCssStyle();
                    return true;
                };
                grid.setGridName = (gridName: string): boolean => {
                    if (!gridName) throw new Error('Please insert a gridName.');
                    grid.info.gName = String(gridName);
                    return true;
                };
                grid.getGridName = (): string => {
                    return grid.info.gName;
                };
                grid.setGridLocked = (isLocked: boolean): boolean => {
                    if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gLocked = isLocked;
                    colInfos.forEach((colInfo, idx) => {
                        if (idx >= 2) {  
                            colInfo.cLocked = isLocked;
                        }
                    })
                    const datas = grid.___getDatasWithoutExceptedProperty(['locked']);
                    grid.load(datas);
                    return true;
                };
                grid.isGridLocked = (): boolean => {
                    return grid.info.gLocked;
                };
                grid.setGridLockedColor = (isLockedColor: boolean): boolean => {
                    if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gLockedColor = isLockedColor;
                    colInfos.forEach((colInfo, idx) => {
                        if (idx >= 2) {  
                            colInfo.cLockedColor = isLockedColor;
                        }
                    })
                    const datas = grid.___getDatasWithoutExceptedProperty(['lockedColor']);
                    grid.load(datas);
                    return true;
                };
                grid.setGridResizable = (isResizable: boolean): boolean => {
                    if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gResizable = isResizable;
                    return true;
                };
                grid.isGridResizable = () => {
                    return grid.info.gResizable;
                };
                grid.setGridRecodeCount = (recodeCount: number): boolean => {
                    recodeCount = utils.validatePositiveIntegerAndZero(recodeCount);
                    grid.info.gRedoCount = recodeCount;
                    return true;
                };
                grid.getGridRecodeCount = (): number => {
                    return grid.info.gRedoCount;
                };
                grid.setGridRedoable = (isRedoable: boolean): boolean => {
                    if (typeof isRedoable !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gRedoable = isRedoable;
                    return true;
                };
                grid.isGridRedoable = (): boolean => {
                    return grid.info.gRedoable;
                };
                grid.setGridVisible = (isVisible: boolean): boolean => {
                    if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gVisible = isVisible;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.isGridVisible = (): boolean => {
                    return grid.info.gVisible;
                };
                grid.setHeaderVisible = (isVisible: boolean): boolean => {
                    if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gHeaderVisible = isVisible;
                    grid._setGridCssStyle();
                    return true;
                };
                grid.isHeaderVisible = (): boolean => {
                    return grid.info.gHeaderVisible;
                };
                grid.setGridRownumLockedColor = (isRownumLockedColor: boolean): boolean => {
                    if (typeof isRownumLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gRownumLockedColor = isRownumLockedColor;
                    colInfos[0].cLockedColor = isRownumLockedColor;

                    for(const row of gridBodyCells) {
                        row[0].cLockedColor = isRownumLockedColor;
                        utils.reConnectedCallbackElement(row[0]);
                    }
                    return true;
                };
                grid.isGridRownumLockedColor = (): boolean => {
                    return grid.info.gRownumLockedColor;
                };
                grid.setGridRownumSize = (rownumSize: number): boolean => {
                    rownumSize = utils.validatePositiveIntegerAndZero(rownumSize);
                    const colInfo = colInfos[0];
                    colInfo.cOriginWidth = String(rownumSize) + utils.extractNumberAndUnit(colInfo.cOriginWidth).unit
                    utils.changeColSize(gId, colInfo.cIndex!, rownumSize);
                    colInfo.cColVisible = rownumSize !== 0;
                    utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
                    return true;
                };
                grid.getGridRownumSize = (): string => {
                    return colInfos[0].cOriginWidth!;
                };
                grid.setGridStatusLockedColor = (isStatusLockedColor: boolean): boolean => {
                    if (typeof isStatusLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gStatusLockedColor = isStatusLockedColor;
                    colInfos[1].cLockedColor = isStatusLockedColor;

                    for(const row of gridBodyCells) {
                        row[1].cLockedColor = isStatusLockedColor;
                        utils.reConnectedCallbackElement(row[1]);
                    }
                    return true;
                };
                grid.isGridStatusLockedColor = (): boolean => {
                    return grid.info.gStatusLockedColor;
                };
                grid.setGridSelectionPolicy = (selectionPolicy: SelectionPolicy.RANGE | SelectionPolicy.SINGLE | SelectionPolicy.NONE): boolean => {
                    if (!utils.isIncludeEnum(selectionPolicyUnit, selectionPolicy)) throw new Error('Please insert the correct selectionPolicy properties. (single, range, none)');
                    grid.info.gSelectionPolicy = selectionPolicy;
                    return true
                };
                grid.getGridSelectionPolicy = (): string => {
                    return grid.info.gSelectionPolicy;
                };
                grid.setGridNullValue = (nullValue: any): boolean => {
                    grid.info.gNullValue = nullValue;
                    grid.__gridBodyCellsReConnected();
                    return true;
                };
                grid.getGridNullValue = (): any => {
                    return utils.deepCopy(grid.info.gNullValue);
                };
                grid.setGridDateFormat = (dateFormat: string): boolean => {
                    grid.info.gDateFormat = dateFormat;
                    grid.__gridBodyCellsReConnected();
                    return true;
                };
                grid.getGridDateFormat = (): string => {
                    return grid.info.gDateFormat;
                };
                grid.setGridMonthFormat = (monthFormat: string): boolean => {
                    grid.info.gMonthFormat = monthFormat;
                    grid.__gridBodyCellsReConnected();
                    return true;
                };
                grid.getGridMonthFormat = (): string => {
                    return grid.info.gMonthFormat;
                };
                grid.setGridAlterRow = (isAlterRow: boolean): boolean => {
                    if (typeof isAlterRow !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gAlterRow = isAlterRow;
                    grid.__gridBodyCellsReConnected();
                    return true;
                };
                grid.setGridFrozenColCount = (frozenColCount: number): boolean => {
                    frozenColCount = utils.validatePositiveIntegerAndZero(frozenColCount);
                    const styleGridTemplateColumns = gridHeader.style.gridTemplateColumns;
                    if (styleGridTemplateColumns.includes('%') && grid.info.gFrozenColCount !== 0) {
                        throw new Error(gId + ' has error. If you set the horizontal size to a percentage, property A is not available.');
                    }

                    grid.info.gFrozenColCount = frozenColCount;
                    const datas = grid.getDatas();
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.getGridFrozenColCount = (): number => {
                    return grid.info.gFrozenColCount;
                };
                grid.setGridFrozenRowCount = (frozenRowCount: number): boolean => {
                    frozenRowCount = utils.validatePositiveIntegerAndZero(frozenRowCount);
                    grid.info.gFrozenRowCount = frozenRowCount;
                    const datas = grid.getDatas();
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.getGridFrozenRowCount = (): number => {
                    return grid.info.gFrozenRowCount;
                };
                grid.setGridSortable = (isSortable: boolean): boolean => {
                    if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gSortable = isSortable;
                    return true;
                };
                grid.isGridSortable = (): boolean => {
                    return grid.info.gSortable;
                };
                grid.setGridFilterable = (isFilterable: boolean): boolean => {
                    if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gFilterable = isFilterable;
                    const datas = grid.getDatas();
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.isGridFilterable = (): boolean => {
                    return grid.info.gFilterable;
                };
                grid.setGridAllCheckable = (isAllCheckable: boolean): boolean => {
                    if (typeof isAllCheckable !== 'boolean') throw new Error('Please insert a boolean type.');
                    grid.info.gAllCheckable = isAllCheckable;
                    return true;
                };
                grid.isGridAllCheckable = (): boolean => {
                    return grid.info.gAllCheckable;
                };
                grid.setGridCheckedValue = (checkeValue: string): boolean => {
                    if (typeof checkeValue !== 'string') throw new Error('Please insert a string type.');
                    if (grid.info.gUncheckedValue === checkeValue) throw new Error('Checked and unchecked values cannot be the same.');
                    const datas = grid.getDatas();
                    for(const rows of datas) {
                        for(const data of rows) {
                            if (data.dataType === 'checkbox') {
                                if (data.value === grid.info.gCheckedValue) {
                                    data.value = checkeValue;
                                }
                            } 
                        }
                    }
                    grid.info.gCheckedValue = checkeValue;
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.getGridCheckedValue = (): string => {
                    return grid.info.gCheckedValue;
                };
                grid.setGridUncheckedValue = (unCheckedValue: string): boolean => {
                    if (typeof unCheckedValue !== 'string') throw new Error('Please insert a string type.');
                    if (grid.info.gCheckedValue === unCheckedValue) throw new Error('Checked and unchecked values cannot be the same.');
                    const datas = grid.getDatas();
                    for(const rows of datas) {
                        for(const data of rows) {
                            if (data.dataType === 'checkbox') {
                                if (data.value !== grid.info.gCheckedValue) {
                                    data.value = unCheckedValue;
                                }
                            } 
                        }
                    }
                    grid.info.gUncheckedValue = unCheckedValue;
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.getGridUncheckedValue = (): string => {
                    return grid.info.gUncheckedValue;
                };
                grid.addCol = (colIndexOrColId: number | string, colInfo: ColInfo): boolean => {
                    let colIndex = grid.__getColIndex(colIndexOrColId);
                    if (colIndex < 2) throw new Error('You cannot add new columns between the row number and status columns.');
                    if (!colIndex || colIndex > grid.getColCount()) colIndex = grid.getColCount();

                    const newColInfo = grid.__getDefaultColInfo(colInfo, true);
                    const datas = grid.getDatas();
                    
                    colInfos.splice(colIndex, 0, newColInfo);
                    colInfos.forEach((colInfo, idx) => {
                        colInfo.cIndex = idx + 1;
                    });

                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.removeCol = (colIndexOrColId: number | string): any[] => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (colIndex <= 2) throw new Error('The row number or status columns cannot be removed.');
                    const result = grid.getColValues(colIndex);

                    colInfos.splice(colIndex - 1, 1);
                    colInfos.forEach((colInfo, idx) => {
                        colInfo.cIndex = idx + 1;
                    });

                    const datas = grid.getDatas();
                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);

                    return result;
                };
                grid.setColInfo = (colInfo: ColInfo): boolean => {
                    if (!colInfo) throw new Error('Column info is required.');
                    if (colInfo.constructor !== Object) throw new Error('Please insert a valid column info');
                    let colIndexOrColId;
                    if (colInfo.index) colIndexOrColId = colInfo.index;
                    if (colInfo.id) colIndexOrColId = colInfo.id;
                    if (!colIndexOrColId) throw new Error('Column id is required.');
                    
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (colIndex <= 2) throw new Error('The row number or status columns are immutable.');

                    const newColInfo = colInfos[colIndex - 1];
                    Object.keys(newColInfo).forEach((key)=>{
                        if(['cId', 'cIndex'].indexOf(key) === -1) {
                            const newColInfoKey = key.charAt(1).toLowerCase() + key.slice(2);
                            Object.keys(colInfo).forEach((colInfoKey) => {
                                if(newColInfoKey === colInfoKey) {
                                    (newColInfo as any)[key] = colInfo[colInfoKey as keyof ColInfo];
                                }
                            });
                        }
                    });

                    const datas = grid.getDatas();
                    datas.forEach((row: any) => {
                        for(const data of row) {
                            if (data.id === newColInfo.cId) {
                                Object.keys(newColInfo).forEach(key => {
                                    if (['cHeader', 'cFooter', 'cRowMerge', 'cColMerge', 'cFilterValue'].indexOf(key) < 0) {
                                        const dataKey = key.charAt(1).toLowerCase() + key.slice(2);
                                        data[dataKey] = (newColInfo as any)[key];
                                    }
                                });
                            }
                        }
                    })

                    grid.__loadHeader();
                    grid.__loadFooter();
                    grid.load(datas);
                    return true;
                };
                grid.getColInfo = (colIndexOrColId: number | string): ColInfo => {
                    colInfo = grid.__getColInfo(colIndexOrColId);

                    const info: ColInfo = {
                        id : colInfo.cId,
                        index : colInfo.cIndex,
                        name : colInfo.cName,
                        untarget : colInfo.cUntarget,
                        colVisible : colInfo.cColVisible,
                        required : colInfo.cRequired,
                        resizable : colInfo.cResizable,
                        originWidth : colInfo.cOriginWidth,
                        dataType : colInfo.cDataType,
                        selectSize : colInfo.cSelectSize,
                        locked : colInfo.cLocked,
                        lockedColor : colInfo.cLockedColor,
                        format : colInfo.cFormat,
                        codes : utils.deepCopy(colInfo.cCodes),
                        defaultCode : colInfo.cDefaultCode,
                        maxLength : colInfo.cMaxLength,
                        maxByte : colInfo.cMaxByte,
                        maxNumber : colInfo.cMaxNumber,
                        minNumber : colInfo.cMinNumber,
                        roundNumber : colInfo.cRoundNumber,
                        align : colInfo.cAlign,
                        verticalAlign : colInfo.cVerticalAlign,
                        overflowWrap : colInfo.cOverflowWrap,
                        wordBreak : colInfo.cWordBreak,
                        whiteSpace : colInfo.cWhiteSpace,
                        backColor : colInfo.cBackColor,
                        fontColor : colInfo.cFontColor,
                        fontBold : colInfo.cFontBold,
                        fontItalic : colInfo.cFontItalic,
                        fontThruline : colInfo.cFontThruline,
                        fontUnderline : colInfo.cFontUnderline,
                        rowMerge : colInfo.cRowMerge,
                        colMerge : colInfo.cColMerge,
                        sortable : colInfo.cSortable,
                        filterable : colInfo.cFilterable,
                        filterValues : utils.deepCopy(colInfo.cFilterValues),
                        filterValue : utils.deepCopy(colInfo.cFilterValue),
                        filter : colInfo.cFilter,
                        rowVisible : colInfo.cRowVisible,
                        header : null,
                        footer : null,
                    };
                    
                    if (colInfo.cHeader && Array.isArray(colInfo.cHeader)) info.header = colInfo.cHeader.join(';');
                    if (colInfo.cFooter && Array.isArray(colInfo.cFooter)) info.footer = colInfo.cFooter.join(';');
                    return info;
                };
                grid.getColDatas = (colIndexOrColId: number | string): CellData[] => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colDatas = [];
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        colDatas.push(grid.getCellData(row, colIndex));
                    }
                    return colDatas;
                };
                grid.setColSameValue = (colIndexOrColId: number | string, value: any, doRecode = false) : boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (doRecode) {
                        const recodes = [];
                        for(let row = 1; row <= grid.getRowCount(); row++) {
                            let cell = grid._getCell(row, colIndex);
                            let recode = utils.getRecodesWithModifyValue(cell, value, true);
                            if (Array.isArray(recode) && recode.length > 0) recodes.push(recode[0]);
                        }
                        utils.recodeGridModify(grid.gId, recodes);
                    }
                    else {
                        for(let row = 1; row <= grid.getRowCount(); row++) {
                            let cell = grid._getCell(row, colIndex);
                            cell.cValue = utils.getValidValue(cell, value);
                            utils.reConnectedCallbackElement(cell);
                        }
                        utils.reloadGridWithModifyCell(gId, colIndex);
                    }
                    return true;
                };
                grid.getColValues = (colIndexOrColId: number | string): any[] => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colValues = [];
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        let cell = grid._getCell(row, colIndex);
                        colValues.push(utils.deepCopy(cell.cValue));
                    }
                    return colValues;
                };
                grid.getColTexts = (colIndexOrColId: number | string): string[] => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colTexts = [];
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        colTexts.push(grid.getCellText(row, colIndex));
                    }
                    return colTexts;
                };
                grid.isColUnique = (colIndexOrColId: number | string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colValues = [];
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        let cell = grid._getCell(row, colIndex);
                        switch (cell.cDataType) {
                            case 'select':
                            case 'checkbox':
                            case 'button':
                            case 'link':
                                colValues.push(utils.getCellText(cell));
                                break;
                            default:
                                colValues.push(cell.cValue);
                                break;
                        }
                    }
                    return colValues.length === new Set(colValues).size;
                };
                grid._doFilter = () => {
                    grid.variables._filters = [];
                    let filter;
                    grid._getHeader().querySelectorAll('.' + gId + '_filterSelect').forEach(function (filterSelect: any) {
                        if (filterSelect.value !== '$$ALL') {
                            filter = {
                                cId : filterSelect.cId,
                                value : filterSelect.value,
                            };
                            grid.__getColInfo(filterSelect.parentNode.parentNode.cIndex).cFilterValue = filterSelect.value;
                            if (filter.value === '$$NULL' || filter.value === null || filter.value === undefined || filter.value === '') filter.value = grid.info.gNullValue;
                            grid.variables._filters.push(filter);
                        }
                    });

                    if (grid.variables._filters.length === 0) {
                        grid._getCells().forEach(function (cells: any) {
                            cells.forEach(function (cell: any) {
                                cell.cFilter = false;
                            })
                        })
                    }
                    else {
                        let rowCount = 1;
                        grid._getCells().forEach(function (cells: any) {
                            let _isFilter = false;
                            cells.forEach(function (cell: any) {
                                grid.variables._filters.forEach(function (filter: any) {
                                    if (cell.cId === filter.cId) {
                                        let cellValue: any = utils.getCellText(cell);

                                        Object.keys(vg.dataType).forEach((key) => {
                                            if(cell.cDataType === key) {
                                                if(vg.dataType[key].getFilterValue) {
                                                    if(typeof vg.dataType[key].getFilterValue !== 'function') throw new Error('getFilterValue must be a function.');
                                                    cellValue = vg.dataType[key].getFilterValue(cell.cValue);
                                                }
                                            }
                                        });
                                        
                                        if (cellValue != filter.value) _isFilter = true;
                                    }
                                });
                            });
                            grid._getRow(rowCount).forEach(function (filterCell: any) {
                                filterCell.cFilter = _isFilter;
                            })
                            rowCount++;
                        });
                    }
                    grid.load(grid.getDatas());
                };
                grid.openFilter = (colIndexOrColId: number | string): boolean => {
                    grid.__getHeaderFilter(colIndexOrColId).style.display = 'block';
                    return true;
                };
                grid.closeFilter = (colIndexOrColId: number | string): boolean => {
                    grid.__getHeaderFilter(colIndexOrColId).style.display = 'none';
                    return true;
                };
                grid.setColFilterValue = (colIndexOrColId: number | string, filterValue: string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    if(!colInfo.cFilterValues!.has(filterValue))  throw new Error('Please insert a valid filterValue. ' + Array.from(colInfo.cFilterValues!).join(', '));

                    let headerCell;
                    let modifyFilterSelect;
                    for(let row = 1; row <= grid.getHeaderRowCount(); row++) {
                        headerCell = grid._getHeaderCell(row, colInfo.cIndex);
                        modifyFilterSelect = headerCell.querySelectorAll('.' + gId + '_filterSelect');
                        if(modifyFilterSelect.length > 0) {
                            modifyFilterSelect = modifyFilterSelect[0]
                            break;
                        }
                    }
                    modifyFilterSelect.value = filterValue;
                    if(modifyFilterSelect.value !== '$$ALL') modifyFilterSelect.style.display = 'block';

                    grid._doFilter();
                    return true;
                };
                grid.getColFilterValues = (colIndexOrColId: number | string): string[]  => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return Array.from(colInfo.cFilterValues!);
                };
                grid.getColFilterValue = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFilterValue;
                };
                grid.getColId = (colIndexOrColId: number | string): string => {
                    const colInfo: CellColInfo  = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cId;
                };
                grid.getColIndex = (colIndexOrColId: number | string): number => {
                    return grid.__getColIndex(colIndexOrColId, true);
                };
                grid.setColName = (colIndexOrColId: number | string, colName: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (!colName) throw new Error('Column Name is required');
                    if (typeof colName !== 'string') throw new Error('Please insert a string type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cName = colName;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        grid._getCell(row, colIndex).cName = colName;
                    }
                    return true;
                };
                grid.getColName = (colIndexOrColId: number | string): string => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId);
                    return colInfo.cName!;
                };
                grid.setColUntarget = (colIndexOrColId: number | string, isUntarget: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isUntarget !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cUntarget = isUntarget;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        grid._getCell(row, colIndex).cUntarget = isUntarget;
                    }
                    return true;
                };
                grid.setColRowMerge = (colIndexOrColId: number | string, isRowMerge: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isRowMerge !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cRowMerge = isRowMerge;
                
                    const datas = grid.getDatas();
                    grid.load(datas);
                    return true;
                };
                grid.isColRowMerge = (colIndexOrColId: number | string): boolean | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cRowMerge;
                };
                grid.setColColMerge = (colIndexOrColId: number | string, isColMerge: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isColMerge !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cColMerge = isColMerge;
                
                    const datas = grid.getDatas();
                    grid.load(datas);
                    return true;
                };
                grid.isColColMerge = (colIndexOrColId: number | string): boolean | null  => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cColMerge;
                };
                grid.setColVisible = (colIndexOrColId: number | string, isVisible: boolean): boolean => {
                    if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    if (isVisible) {
                        utils.changeColSize(gId, colInfo.cIndex!, utils.extractNumberAndUnit(colInfo.cOriginWidth).number);
                    }
                    else {
                        utils.changeColSize(gId, colInfo.cIndex!, 0)
                    }
                    colInfo.cColVisible = isVisible;
                    grid.__loadHeader();
                    utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
                    return true;
                };
                grid.isColVisible = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cColVisible!;
                };
                grid.setColRequired = (colIndexOrColId: number | string, isRequired: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex, true);
                    colInfo.cRequired = isRequired;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        grid._getCell(row, colIndex).cRequired = isRequired;
                    }
                    return true;
                };
                grid.isColRequired = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cRequired!;
                };
                grid.setColResizable = (colIndexOrColId: number | string, isResizable: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    if (typeof isResizable !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    colInfo.cResizable = isResizable;
                    grid.__loadHeader();
                    return true;
                };
                grid.isColResizable = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cResizable!;
                };
                grid.setColSortable = (colIndexOrColId: number | string, isSortable: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    if (typeof isSortable !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    colInfo.cSortable = isSortable;
                    return true;
                };
                grid.isColSortable = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cSortable!;
                };
                grid.setColFilterable = (colIndexOrColId: number | string, isFilterable: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isFilterable !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex, true);
                    colInfo.cFilterable = isFilterable;
                    grid.__loadHeader();
                    utils.reloadFilterValue(gId, colIndex);
                    return true;
                };
                grid.isColFilterable = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFilterable!;
                };
                grid.setColOriginWidth = (colIndexOrColId: number | string, originWidth: string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    const newOriginWidth = utils.extractNumberAndUnit(originWidth);
                    if (!utils.isIncludeEnum(enumWidthUnit, newOriginWidth.unit)) throw new Error('Width units can only be pixel or %.');
                    colInfo.cOriginWidth = newOriginWidth.number + newOriginWidth.unit;
                    utils.changeColSize(gId, colInfo.cIndex!, newOriginWidth.number);
                    if(newOriginWidth.number === 0) colInfo.cColVisible = false;
                    else colInfo.cColVisible = true;
                    grid.__loadHeader();
                    utils.reloadGridWithModifyCell(gId, colInfo.cIndex!);
                    return true;
                };
                grid.getColOriginWidth = (colIndexOrColId: number | string): string => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cOriginWidth!;
                };
                grid.setColDataType = (colIndexOrColId: number | string, dataType: string): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cDataType = dataType;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cDataType = dataType;
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColDataType = (colIndexOrColId: number | string): string => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cDataType!;
                };
                grid.setColSelectSize = (colIndexOrColId: number | string, cssTextSelectSize: string): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cSelectSize = cssTextSelectSize;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cSelectSize = cssTextSelectSize;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColSelectSize = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cSelectSize;
                };
                grid.setColLocked = (colIndexOrColId: number | string, isLocked: boolean): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cLocked = isLocked;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cLocked = isLocked;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColLocked = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cLocked!;
                };
                grid.setColLockedColor = (colIndexOrColId: number | string, isLockedColor: boolean): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cLockedColor = isLockedColor;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cLockedColor = isLockedColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColLockedColor = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cLockedColor!;
                };
                grid.setColFormat = (colIndexOrColId: number | string, format: string): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof format !== 'string') throw new Error('Please insert a string type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFormat = format;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFormat = format;
                        if(cell.cDataType === 'mask') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColFormat = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFormat;
                };
                grid.setColCodes = (colIndexOrColId: number | string, codes: string[]): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cCodes = codes;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cCodes = codes;
                        if(cell.cDataType === 'code') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColCodes = (colIndexOrColId: number | string): string[] | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cCodes;
                };
                grid.setColDefaultCode = (colIndexOrColId: number | string, defaultCode: string): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cDefaultCode = defaultCode;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cDefaultCode = defaultCode;
                        if(cell.cDataType === 'code') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColDefaultCode = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cDefaultCode;
                };
                grid.setColMaxLength = (colIndexOrColId: number | string, maxLength: number): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    maxLength = utils.validatePositiveIntegerAndZero(maxLength);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cMaxLength = maxLength;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cMaxLength = maxLength;
                        if(cell.cDataType === 'text') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColMaxLength = (colIndexOrColId: number | string): number | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cMaxLength;
                };
                grid.setColMaxByte = (colIndexOrColId: number | string, maxByte: number): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    maxByte = utils.validatePositiveIntegerAndZero(maxByte);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cMaxByte = maxByte;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cMaxByte = maxByte;
                        if(cell.cDataType === 'text') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColMaxByte = (colIndexOrColId: number | string): number | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cMaxByte;
                };
                grid.setColMaxNumber = (colIndexOrColId: number | string, maxNumber: number): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    maxNumber = utils.validateNumber(maxNumber);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cMaxNumber = maxNumber;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cMaxNumber = maxNumber;
                        if(cell.cDataType === 'number') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColMaxNumber = (colIndexOrColId: number | string): number | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cMaxNumber;
                };
                grid.setColMinNumber = (colIndexOrColId: number | string, minNumber: number): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    minNumber = utils.validateNumber(minNumber);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cMinNumber = minNumber;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cMinNumber = minNumber;
                        if(cell.cDataType === 'number') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColMinNumber = (colIndexOrColId: number | string): number | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cMinNumber;
                };
                grid.setColRoundNumber = (colIndexOrColId: number | string, roundNumber: number): boolean => {
                    grid.__checkColRownumOrStatus(colIndexOrColId);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    roundNumber = utils.validateIntegerAndZero(roundNumber);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cRoundNumber = roundNumber;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cRoundNumber = roundNumber;
                        if(cell.cDataType === 'number') {
                            cell.cValue = utils.getValidValue(cell, cell.cValue);
                        }
                        utils.reConnectedCallbackElement(cell);
                    }
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getColRoundNumber = (colIndexOrColId: number | string): number | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cRoundNumber;
                };
                grid.setColAlign = (colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if(!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cAlign = align;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cAlign = align;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColAlign = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cAlign;
                };
                grid.setColVerticalAlign = (colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if(!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cVerticalAlign = verticalAlign;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cVerticalAlign = verticalAlign;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColVerticalAlign = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cVerticalAlign;
                };
                grid.setColOverflowWrap = (colIndexOrColId: number | string, overflowWrap: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cOverflowWrap = overflowWrap;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cOverflowWrap = overflowWrap;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColOverflowWrap = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cOverflowWrap;
                };
                grid.setColWordBreak = (colIndexOrColId: number | string, wordBreak: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cWordBreak = wordBreak;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cWordBreak = wordBreak;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColWordBreak = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cWordBreak;
                };
                grid.setColWhiteSpace = (colIndexOrColId: number | string, whiteSpace: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cWhiteSpace = whiteSpace;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cWhiteSpace = whiteSpace;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColWhiteSpace = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cWhiteSpace;
                };
                grid.setColBackColor = (colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cBackColor = hexadecimalBackColor;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cBackColor = hexadecimalBackColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColBackColor = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cBackColor;
                };
                grid.setColFontColor = (colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFontColor = hexadecimalFontColor;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFontColor = hexadecimalFontColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.getColFontColor = (colIndexOrColId: number | string): string | null => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFontColor;
                };
                grid.setColFontBold = (colIndexOrColId: number | string, isFontBold: boolean): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFontBold = isFontBold;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFontBold = isFontBold;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColFontBold = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFontBold!;
                };
                grid.setColFontItalic = (colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFontItalic = isFontItalic;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFontItalic = isFontItalic;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColFontItalic = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFontItalic!;
                };
                grid.setColFontThruline = (colIndexOrColId: number | string, isFontThruline: boolean): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFontThruline = isFontThruline;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFontThruline = isFontThruline;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColFontThruline = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFontThruline!;
                };
                grid.setColFontUnderline = (colIndexOrColId: number | string, isFontUnderline: boolean): boolean => {
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
                    const colInfo: CellColInfo = grid.__getColInfo(colIndex);
                    colInfo.cFontUnderline = isFontUnderline;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        const cell = grid._getCell(row, colIndex);
                        cell.cFontUnderline = isFontUnderline;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isColFontUnderline = (colIndexOrColId: number | string): boolean => {
                    const colInfo: CellColInfo = grid.__getColInfo(colIndexOrColId, true);
                    return colInfo.cFontUnderline!;
                };
                grid.addRow = (rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]): boolean => {
                    let row, addKeyValueOrDatas;

                    if (rowOrValuesOrDatas === 0) rowOrValuesOrDatas = 1
                    if (rowOrValuesOrDatas) {
                        if (typeof rowOrValuesOrDatas === 'number') {
                            row = rowOrValuesOrDatas - 1;
                            addKeyValueOrDatas = valuesOrDatas;
                        }
                        else {
                            addKeyValueOrDatas = rowOrValuesOrDatas;
                        }
                    }
                    else {
                        addKeyValueOrDatas = valuesOrDatas;
                    }
                    if (row === null || row === undefined || row > grid.getRowCount()) row = grid.getRowCount();
                    if (!addKeyValueOrDatas) addKeyValueOrDatas = [[{}]];
                    else addKeyValueOrDatas = [addKeyValueOrDatas];
                    if (addKeyValueOrDatas === null || !Array.isArray(addKeyValueOrDatas)) throw new Error('Please insert valid datas.');
                    const isKeyValue = utils.checkIsValueOrData(addKeyValueOrDatas);
                    const datas = grid.getDatas();
                    let cnt = 0;
                    for(const keyValueOrData of addKeyValueOrDatas) {
                        if (isKeyValue) {
                            const tempRow = [];
                            let tempCol;
                            for (const key in keyValueOrData) {
                                tempCol = {
                                    id : key,
                                    value : (keyValueOrData as any)[key],
                                };
                                tempRow.push(tempCol);
                            }
                            datas.splice(row + cnt, 0, tempRow);
                        }
                        else {
                            datas.splice(row + cnt, 0, keyValueOrData);
                        }
                        cnt++;
                    }
                    grid.load(datas);
                    for(let r = row; r < row + cnt; r++) {
                        grid.setRowStatus(r + 1, 'C');
                    }
                    utils.focusCell(grid._getCell(row + 1, 'v-g-status'));
                    return true;
                };
                grid.removeRow = (row: number): Record<string, any> => {
                    grid.__checkRowIndex(row);
                    const result = grid.getRowValues(row);
                    result['v-g-status'] = 'D';
                    const datas = grid.getDatas();
                    datas.splice(row - 1, 1);
                    grid.load(datas);
                    return result;
                };
                grid.setRowStatus = (row: number, status: string): boolean => {
                    grid.__checkRowIndex(row);
                    if (!utils.isIncludeEnum(statusUnit, status)) throw new Error('Please insert the correct status code. (C, U, D)');
                    const statusCell = grid._getCell(row, 'v-g-status');
                    statusCell.cValue = status;
                    utils.reConnectedCallbackElement(statusCell);
                    return true;
                };
                grid.getRowStatus = (row: number): string => {
                    grid.__checkRowIndex(row);
                    return grid._getCell(row, 'v-g-status').cValue;
                };
                grid.setRowDatas = (row: number, cellDatas: Record<string, any>[]): boolean => {
                    for(const cellData of cellDatas) {
                        grid.__setCellData(row, cellData.id, cellData, false);
                    }
                    return true;
                };
                grid.getRowDatas = (row: number): Record<string, any>[] => {
                    grid.__checkRowIndex(row);
                    const rowDatas = [];
                    for(const colInfo of colInfos) {
                        rowDatas.push(grid.getCellData(row, colInfo.cIndex));
                    }
                    return rowDatas;
                };
                grid.setRowValues = (row: number, values: Record<string, any>, doRecode = false): boolean => {
                    row = 2;
                    grid.__checkRowIndex(row);
                    if (!values || values.constructor !== Object) throw new Error('Please insert a valid value.');
                    let value = null;
                    let cell = null;

                    if (doRecode) {
                        const recodes = [];
                        let recode
                        for(const colInfo of colInfos) {
                            if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                            for(const key in values) {
                                if (colInfo.cId === key) value = values[key];
                            }
                            cell = grid._getCell(row, colInfo.cIndex);
                            recode = utils.getRecodesWithModifyValue(cell, value, true);
                            if (Array.isArray(recode) && recode.length > 0) recodes.push(recode[0]);
                        }
                        utils.recodeGridModify(grid.gId, recodes);
                    }
                    else {
                        for(const colInfo of colInfos) {
                            if (colInfo.cId === 'v-g-rownum' || colInfo.cId === 'v-g-status') continue;
                            for(const key in values) {
                                if (colInfo.cId === key) value = values[key];
                            }
                            cell = grid._getCell(row, colInfo.cIndex);
                            cell.cValue = utils.getValidValue(cell, value);
                            utils.reConnectedCallbackElement(cell);
                            utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
                        }
                    }
                    return true;
                };
                grid.getRowValues = (row: number): Record<string, any> => {
                    grid.__checkRowIndex(row);
                    const rowValues = {};
                    for(const cell of gridBodyCells[row - 1]) {
                        (rowValues as any)[cell.cId] = utils.deepCopy(cell.cValue);
                    }
                    return rowValues;
                };
                grid.getRowTexts = (row: number): Record<string, string> => {
                    grid.__checkRowIndex(row);
                    const rowTexts = {};
                    for(const cell of gridBodyCells[row - 1]) {
                        (rowTexts as any)[cell.cId] = utils.getCellText(cell);
                    }
                    return rowTexts;
                };
                grid.setRowVisible = (row: number, isVisible: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(let c = 1; c <= grid.getColCount(); c++) {
                        const cell = grid._getCell(row, c);
                        cell.cRowVisible = isVisible;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.isRowVisible = (row: number): boolean => {
                    grid.__checkRowIndex(row);
                    const cell = grid._getCell(row, 1);
                    return cell.cRowVisible;
                };
                grid.setRowDataType = (row: number, dataType: string): boolean => {
                    grid.__checkRowIndex(row);
                    if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cDataType = dataType;
                        utils.reConnectedCallbackElement(cell);
                    }
                    
                    utils.reloadGridForMerge(gId);
                    
                    grid.reloadFilterValue();
                    
                    grid.reloadFooterValue();
                    return true;
                };
                grid.setRowLocked = (row: number, isRowLocked: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowLocked !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cLocked = isRowLocked;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowLockedColor = (row: number, isRowLockedColor: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cLockedColor = isRowLockedColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowAlign = (row: number, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
                    grid.__checkRowIndex(row);
                    if (!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cAlign = align;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowVerticalAlign = (row: number, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
                    grid.__checkRowIndex(row);
                    if (!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert valid vertical align. (top, center, bottom)');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cVerticalAlign = verticalAlign;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowBackColor = (row: number, hexadecimalBackColor: string): boolean => {
                    grid.__checkRowIndex(row);
                    if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cBackColor = hexadecimalBackColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowFontColor = (row: number, hexadecimalFontColor: string): boolean => {
                    grid.__checkRowIndex(row);
                    if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cFontColor = hexadecimalFontColor;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowFontBold = (row: number, isRowFontBold: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cFontBold = isRowFontBold;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowFontItalic = (row: number, isRowFontItalic: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cFontItalic = isRowFontItalic;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowFontThruline = (row: number, isRowFontThruline: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cFontThruline = isRowFontThruline;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.setRowFontUnderline = (row: number, isRowFontUnderline: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    if (typeof isRowFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
                    for(const cell of gridBodyCells[row - 1]) {
                        if (cell.cId === 'v-g-rownum' || cell.cId === 'v-g-status') continue;
                        cell.cFontUnderline = isRowFontUnderline;
                        grid.__gridCellReConnectedWithControlSpan(cell);
                    }
                    return true;
                };
                grid.searchRowsWithMatched = (matches: Record<string, any>): number[] => {
                    if (matches.constructor !== Object) throw new Error('Please insert a valid matches. (Object)');
                    const matchedRows: number[] = [];
                    let isMatched;
                    gridBodyCells.forEach((row, rowIndex: number) => {
                        isMatched = true;
                        for(const cell of row) {
                            for(const key of Object.keys(matches)) {
                                if (cell.cId === key && cell.cValue !== matches[key]) {
                                    isMatched = false;
                                    break;
                                }
                            }
                        }
                        if(isMatched) matchedRows.push(rowIndex + 1);
                    })
                    return matchedRows;
                };
                grid.searchRowDatasWithMatched = (matches: Record<string, any>): Record<string, any>[][] => {
                    const matchedRows = grid.searchRowsWithMatched(matches);
                    const matchedRowDatas: Record<string, any>[][] = [];
                    matchedRows.forEach((row: number) => {
                        matchedRowDatas.push(grid.getRowDatas(row));
                    })
                    return matchedRowDatas;
                };
                grid.searchRowValuesWithMatched = (matches: Record<string, any>): Record<string, any>[] => {
                    const matchedRows = grid.searchRowsWithMatched(matches);
                    const matchedRowValues: Record<string, any>[] = [];
                    matchedRows.forEach((row: number) => {
                        matchedRowValues.push(grid.getRowValues(row));
                    })
                    return matchedRowValues;
                };
                grid.searchRowsWithFunction = (func: Function): number[] => {
                    if (typeof func !== 'function') throw new Error('Please insert a valid function.');
                    const matchedRows = [];
                    let isMatched;
                    for(let row = 1; row <= grid.getRowCount(); row++) {
                        isMatched = func(grid.getRowDatas(row));
                        if(isMatched) matchedRows.push(row);
                    }
                    return matchedRows;
                };
                grid.searchRowDatasWithFunction = (func: Function): Record<string, any>[][] => {
                    const matchedRows = grid.searchRowsWithFunction(func);
                    const matchedRowDatas: Record<string, any>[][] = [];
                    matchedRows.forEach((row: number) => {
                        matchedRowDatas.push(grid.getRowDatas(row));
                    })
                    return matchedRowDatas;
                };
                grid.searchRowValuesWithFunction = (func: Function): Record<string, any>[] => {
                    const matchedRows = grid.searchRowsWithFunction(func);
                    const matchedRowValues: Record<string, any>[] = [];
                    matchedRows.forEach((row: number) => {
                        matchedRowValues.push(grid.getRowValues(row));
                    })
                    return matchedRowValues;
                };
                grid.__gridCellReConnectedWithControlSpan = (cell: Cell) => {
                    utils.reConnectedCallbackElement(cell);
                    if(cell.rowSpan) {
                        for(let row = cell.row + 1; row < cell.row + cell.rowSpan; row++) {
                            grid.__gridCellReConnectedWithControlSpan(grid._getCell(row, cell.col));
                        }
                    }
                    if(cell.colSpan) {
                        for(let col = cell.col + 1; col < cell.col + cell.colSpan; col++) {
                            grid.__gridCellReConnectedWithControlSpan(grid._getCell(cell.row, col));
                        }
                    }
                };
                grid.__getData = (cell: Cell, exceptedProperty: string[] = []): CellData => {
                    const data: any = {};
                    data.gridId = gId;
                    data.gridName = grid.info.gName;
                    data.id = cell.cId;
                    data.index = cell.cIndex;
                    data.name = cell.cName;
                    data.row = cell.row;
                    data.col = cell.col;
                    data.untarget = cell.cUntarget;
                    data.colVisible = cell.cColVisible;
                    data.rowVisible = cell.cRowVisible;
                    data.required = cell.cRequired;
                    data.resizable = cell.cResizable;
                    data.originWidth = cell.cOriginWidth;
                    data.dataType = cell.cDataType;
                    data.selectSize = cell.cSelectSize;
                    data.locked = cell.cLocked;
                    data.lockedColor = cell.cLockedColor;
                    data.format = cell.cFormat;
                    data.codes = utils.deepCopy(cell.cCodes);
                    data.defaultCode = cell.cDefaultCode;
                    data.maxLength = cell.cMaxLength;
                    data.maxByte = cell.cMaxByte;
                    data.maxNumber = cell.cMaxNumber;
                    data.minNumber = cell.cMinNumber;
                    data.roundNumber = cell.cRoundNumber;
                    data.align = cell.cAlign;
                    data.verticalAlign = cell.cVerticalAlign;
                    data.overflowWrap = cell.cOverflowWrap;
                    data.wordBreak = cell.cWordBreak;
                    data.whiteSpace = cell.cWhiteSpace;
                    data.backColor = cell.cBackColor;
                    data.fontColor = cell.cFontColor;
                    data.fontBold = cell.cFontBold;
                    data.fontItalic = cell.cFontItalic;
                    data.fontThruline = cell.cFontThruline;
                    data.fontUnderline = cell.cFontUnderline;
                    data.value = utils.deepCopy(cell.cValue);
                    data.filter = utils.deepCopy(cell.cFilter);

                    if (exceptedProperty) {
                        if (exceptedProperty.indexOf('untarget') >= 0) delete data.untarget;
                        if (exceptedProperty.indexOf('colVisible') >= 0) delete data.colVisible;
                        if (exceptedProperty.indexOf('rowVisible') >= 0) delete data.rowVisible;
                        if (exceptedProperty.indexOf('required') >= 0) delete data.required;
                        if (exceptedProperty.indexOf('resizable') >= 0) delete data.resizable;
                        if (exceptedProperty.indexOf('originWidth') >= 0) delete data.originWidth;
                        if (exceptedProperty.indexOf('dataType') >= 0) delete data.dataType;
                        if (exceptedProperty.indexOf('selectSize') >= 0) delete data.selectSize;
                        if (exceptedProperty.indexOf('locked') >= 0) delete data.locked;
                        if (exceptedProperty.indexOf('lockedColor') >= 0) delete data.lockedColor;
                        if (exceptedProperty.indexOf('format') >= 0) delete data.format;
                        if (exceptedProperty.indexOf('codes') >= 0) delete data.codes;
                        if (exceptedProperty.indexOf('defaultCode') >= 0) delete data.defaultCode;
                        if (exceptedProperty.indexOf('maxLength') >= 0) delete data.maxLength;
                        if (exceptedProperty.indexOf('maxByte') >= 0) delete data.maxByte;
                        if (exceptedProperty.indexOf('maxNumber') >= 0) delete data.maxNumber;
                        if (exceptedProperty.indexOf('minNumber') >= 0) delete data.minNumber;
                        if (exceptedProperty.indexOf('roundNumber') >= 0) delete data.roundNumber;
                        if (exceptedProperty.indexOf('align') >= 0) delete data.align;
                        if (exceptedProperty.indexOf('verticalAlign') >= 0) delete data.verticalAlign;
                        if (exceptedProperty.indexOf('backColor') >= 0) delete data.backColor;
                        if (exceptedProperty.indexOf('fontColor') >= 0) delete data.fontColor;
                        if (exceptedProperty.indexOf('fontBold') >= 0) delete data.fontBold;
                        if (exceptedProperty.indexOf('fontItalic') >= 0) delete data.fontItalic;
                        if (exceptedProperty.indexOf('fontThruline') >= 0) delete data.fontThruline;
                        if (exceptedProperty.indexOf('fontUnderline') >= 0) delete data.fontUnderline;
                        if (exceptedProperty.indexOf('value') >= 0) delete data.value;
                        if (exceptedProperty.indexOf('filter') >= 0) delete data.filter;
                    }
                    data.text = utils.getCellText(cell);
                    return data;
                };
                grid.__setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData, isImmutableColCheck = true) => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    if (colIndex <= 2) {
                        if (isImmutableColCheck) throw new Error('The row number or status columns are immutable.');
                        return false;
                    }
                    const cell = grid._getCell(row, colIndex);
                    if (cellData.untarget) cell.cUntarget = cellData.untarget;
                    if (cellData.dataType) cell.cDataType = cellData.dataType;
                    if (cellData.selectSize) cell.cSelectSize = cellData.selectSize;
                    if (cellData.locked) cell.cLocked = cellData.locked;
                    if (cellData.lockedColor) cell.cLockedColor = cellData.lockedColor;
                    if (cellData.format) cell.cFormat = cellData.format;
                    if (cellData.codes) cell.cCodes = cellData.codes;
                    if (cellData.defaultCode) cell.cDefaultCode = cellData.defaultCode;
                    if (cellData.maxLength) cell.cMaxLength = cellData.maxLength;
                    if (cellData.maxByte) cell.cMaxByte = cellData.maxByte;
                    if (cellData.maxNumber) cell.cMaxNumber = cellData.maxNumber;
                    if (cellData.minNumber) cell.cMinNumber = cellData.minNumber;
                    if (cellData.roundNumber) cell.cRoundNumber = cellData.roundNumber;
                    if (cellData.value) cell.cValue = cellData.value;
                    if (cellData.align) cell.cAlign = cellData.align;
                    if (cellData.verticalAlign) cell.cVerticalAlign = cellData.verticalAlign;
                    if (cellData.overflowWrap) cell.cOverflowWrap = cellData.overflowWrap;
                    if (cellData.wordBreak) cell.cWordBreak = cellData.wordBreak;
                    if (cellData.whiteSpace) cell.cWhiteSpace = cellData.whiteSpace;
                    if (cellData.backColor) cell.cBackColor = cellData.backColor;
                    if (cellData.fontColor) cell.cFontColor = cellData.fontColor;
                    if (cellData.fontBold) cell.cFontBold = cellData.fontBold;
                    if (cellData.fontItalic) cell.cFontItalic = cellData.fontItalic;
                    if (cellData.fontThruline) cell.cFontThruline = cellData.fontThruline;
                    if (cellData.fontUnderline) cell.cFontUnderline = cellData.fontUnderline;
                    utils.reConnectedCallbackElement(cell);
                    utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
                    return true;
                };
                grid.setCellData = (row: number, colIndexOrColId: number | string, cellData: CellData): boolean => {
                    return grid.__setCellData(row, colIndexOrColId, cellData);
                }
                grid.getCellData = (row: number, colIndexOrColId: number | string): CellData => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    
                    const cell = grid._getCell(row, colIndex);
                    const data = grid.__getData(cell);
                    return data;
                }
                grid.setCellValue = (row: number, colIndexOrColId: number | string, value: any, doRecode = false): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);

                    const cell = grid._getCell(row, colIndex);
                    if (doRecode) {
                        utils.recodeGridModify(cell.gId, utils.getRecodesWithModifyValue(cell, value, true));
                    }
                    else {
                        cell.cValue = utils.getValidValue(cell, value);
                        utils.reConnectedCallbackElement(cell);
                        utils.reloadGridWithModifyCell(cell.gId, cell.cIndex);
                    }
                    return true;
                };
                grid.getCellValue = (row: number, colIndexOrColId: number | string): any => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);

                    return utils.deepCopy(grid._getCell(row, colIndex).cValue);
                };
                grid.getCellText = (row: number, colIndexOrColId: number | string): string => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);

                    return utils.getCellText(grid._getCell(row, colIndex));
                };
                grid.setCellRequired = (row: number, colIndexOrColId: number | string, isRequired: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (typeof isRequired !== 'boolean') throw new Error('Please insert a boolean type.');

                    const cell = grid._getCell(row, colIndex);
                    cell.cRequired = isRequired;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                }
                grid.getCellRequired = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cRequired;
                }
                grid.setCellDataType = (row: number, colIndexOrColId: number | string, dataType: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    
                    if (!utils.isIncludeEnum(dataTypeUnit, dataType)) throw new Error('Please insert a valid dataType.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cDataType = dataType;
                    utils.reConnectedCallbackElement(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellDataType = (row: number, colIndexOrColId: number | string): string => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    return grid._getCell(row, colIndex).cDataType;
                };
                grid.setCellLocked = (row: number, colIndexOrColId: number | string, isLocked: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (typeof isLocked !== 'boolean') throw new Error('Please insert a boolean type.');

                    const cell = grid._getCell(row, colIndex);
                    cell.cLocked = isLocked;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellLocked = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cLocked;
                };
                grid.setCellLockedColor = (row: number, colIndexOrColId: number | string, isLockedColor: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (typeof isLockedColor !== 'boolean') throw new Error('Please insert a boolean type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cLockedColor = isLockedColor;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellLockedColor = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cLockedColor;
                };
                grid.setCellFormat = (row: number, colIndexOrColId: number | string, format: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (typeof format !== 'string') throw new Error('Please insert a string type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFormat = format;
                    if(cell.cDataType === 'mask') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellFormat = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFormat;
                };
                grid.setCellCodes = (row: number, colIndexOrColId: number | string, codes: string[]): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    if (!Array.isArray(codes)) throw new Error('Please insert a vaild codes. (Array)');
                    const cell = grid._getCell(row, colIndex);
                    cell.cCodes = codes;
                    if(cell.cDataType === 'code') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellCodes = (row: number, colIndexOrColId: number | string): string[] | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cCodes;
                };
                grid.setCellDefaultCode = (row: number, colIndexOrColId: number | string, defaultCode: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    const cell = grid._getCell(row, colIndex);
                    cell.cDefaultCode = defaultCode;
                    if(cell.cDataType === 'code') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellDefaultCode = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cDefaultCode;
                };
                grid.setCellMaxLength = (row: number, colIndexOrColId: number | string, maxLength: number): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    maxLength = utils.validatePositiveIntegerAndZero(maxLength);
                    const cell = grid._getCell(row, colIndex);
                    cell.cMaxLength = maxLength;
                    if(cell.cDataType === 'text') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellMaxLength = (row: number, colIndexOrColId: number | string): number | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cMaxLength;
                };
                grid.setCellMaxByte = (row: number, colIndexOrColId: number | string, maxByte: number): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    maxByte = utils.validatePositiveIntegerAndZero(maxByte);
                    const cell = grid._getCell(row, colIndex);
                    cell.cMaxByte = maxByte;
                    if(cell.cDataType === 'text') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellMaxByte = (row: number, colIndexOrColId: number | string): number | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cMaxByte;
                };
                grid.setCellMaxNumber = (row: number, colIndexOrColId: number | string, maxNumber: number): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    maxNumber = utils.validateNumber(maxNumber);
                    const cell = grid._getCell(row, colIndex);
                    cell.cMaxNumber = maxNumber;
                    if(cell.cDataType === 'number') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellMaxNumber = (row: number, colIndexOrColId: number | string): number | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cMaxNumber;
                };
                grid.setCellMinNumber = (row: number, colIndexOrColId: number | string, minNumber: number): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    minNumber = utils.validateNumber(minNumber);
                    const cell = grid._getCell(row, colIndex);
                    cell.cMinNumber = minNumber;
                    if(cell.cDataType === 'number') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellMinNumber = (row: number, colIndexOrColId: number | string): number | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cMinNumber;
                };
                grid.setCellRoundNumber = (row: number, colIndexOrColId: number | string, roundNumber: number): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    roundNumber = utils.validateIntegerAndZero(roundNumber);
                    const cell = grid._getCell(row, colIndex);
                    cell.cRoundNumber = roundNumber;
                    if(cell.cDataType === 'number') {
                        cell.cValue = utils.getValidValue(cell, cell.cValue);
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    utils.reloadGridWithModifyCell(gId, colIndex);
                    return true;
                };
                grid.getCellRoundNumber = (row: number, colIndexOrColId: number | string): number | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cRoundNumber;
                };
                grid.setCellAlign = (row: number, colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if(!utils.isIncludeEnum(alignUnit, align)) throw new Error('Please insert a vaild align. (left, center, right)');
                    const cell = grid._getCell(row, colIndex);
                    cell.cAlign = align;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellAlign = (row: number, colIndexOrColId: number | string): string => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cAlign;
                };
                grid.setCellVerticalAlign = (row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if(!utils.isIncludeEnum(verticalAlignUnit, verticalAlign)) throw new Error('Please insert a vaild align. (top, center, bottom)');
                    const cell = grid._getCell(row, colIndex);
                    cell.cVerticalAlign = verticalAlign;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellVerticalAlign = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cVerticalAlign;
                };
                grid.setCellOverflowWrap = (row: number, colIndexOrColId: number | string, overflowWrap: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    const cell = grid._getCell(row, colIndex);
                    cell.cOverflowWrap = overflowWrap;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellOverflowWrap = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cOverflowWrap;
                };
                grid.setCellWordBreak = (row: number, colIndexOrColId: number | string, wordBreak: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    const cell = grid._getCell(row, colIndex);
                    cell.cWordBreak = wordBreak;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellWordBreak = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cWordBreak;
                };
                grid.setCellWhiteSpace = (row: number, colIndexOrColId: number | string, whiteSpace: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    const cell = grid._getCell(row, colIndex);
                    cell.cWhiteSpace = whiteSpace;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellWhiteSpace = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cWhiteSpace;
                };
                grid.setCellVisible = (row: number, colIndexOrColId: number | string, isVisible: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if (typeof isVisible !== 'boolean') throw new Error('Please insert a boolean type.');

                    const cell = grid._getCell(row, colIndex);
                    if (isVisible) {
                        if (cell.firstChild) cell.firstChild.style.removeProperty('display');
                    }
                    else {
                        if (cell.firstChild) cell.firstChild.style.display = 'none'
                    }
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellVisible = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    const cell = grid._getCell(row, colIndex);
                    if(cell.firstChild) cell.firstChild.style.display !== 'none';
                    return false;
                };
                grid.setCellBackColor = (row: number, colIndexOrColId: number | string, hexadecimalBackColor: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if(hexadecimalBackColor !== '#000' && hexadecimalBackColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalBackColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    const cell = grid._getCell(row, colIndex);
                    cell.cBackColor = hexadecimalBackColor;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellBackColor = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cBackColor;
                };
                grid.setCellFontColor = (row: number, colIndexOrColId: number | string, hexadecimalFontColor: string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if(hexadecimalFontColor !== '#000' && hexadecimalFontColor !== '#000000' && utils.getHexColorFromColorName(hexadecimalFontColor) === '#000000') throw new Error('Please enter the correct hexadecimal color. (#ffffff)');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFontColor = hexadecimalFontColor;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.getCellFontColor = (row: number, colIndexOrColId: number | string): string | null => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFontColor;
                };
                grid.setCellFontBold = (row: number, colIndexOrColId: number | string, isFontBold: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if (typeof isFontBold !== 'boolean') throw new Error('Please insert a boolean type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFontBold = isFontBold;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellFontBold = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFontBold;
                };
                grid.setCellFontItalic = (row: number, colIndexOrColId: number | string, isFontItalic: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if (typeof isFontItalic !== 'boolean') throw new Error('Please insert a boolean type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFontItalic = isFontItalic;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellFontItalic = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFontItalic;
                };
                grid.setCellFontThruline = (row: number, colIndexOrColId: number | string, isFontThruline: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if (typeof isFontThruline !== 'boolean') throw new Error('Please insert a boolean type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFontThruline = isFontThruline;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellFontThruline = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFontThruline;
                };
                grid.setCellFontUnderline = (row: number, colIndexOrColId: number | string, isFontUnderline: boolean): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    if (typeof isFontUnderline !== 'boolean') throw new Error('Please insert a boolean type.');
                    const cell = grid._getCell(row, colIndex);
                    cell.cFontUnderline = isFontUnderline;
                    grid.__gridCellReConnectedWithControlSpan(cell);
                    return true;
                };
                grid.isCellFontUnderline = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    return grid._getCell(row, colIndex).cFontUnderline;
                };
                grid.setTargetCell = (row:number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);

                    const targetCell = grid._getCell(row, colIndex);
                    if (!utils.isCellVisible(targetCell)) return false;

                    utils.activeGrid = grid;
                    return utils.selectCell(targetCell);
                }
                grid.getTargetRow = (): number | null => {
                    return grid.variables._targetCell ? grid.variables._targetCell.row : null;
                }
                grid.getTargetCol = (): string | null => {
                    return grid.variables._targetCell ? grid.variables._targetCell.cId : null;
                }
                grid.setActiveCells = (startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(startRow);
                    grid.__checkRowIndex(endRow);
                    const startColIndex = grid.__getColIndex(startColIndexOrColId, true);
                    const endColIndex = grid.__getColIndex(endColIndexOrColId, true);
                    grid.__checkColIndex(startColIndex);
                    grid.__checkColIndex(endColIndex);

                    const startCell = grid._getCell(startRow, startColIndex);
                    const endCell = grid._getCell(endRow, endColIndex);
                    
                    if (!utils.isCellVisible(startCell)) return false;
                    if (!utils.isCellVisible(endCell)) return false;

                    utils.activeGrid = grid;
                    grid.variables._targetCell = startCell;
                    utils.unselectCells(grid.gId);
                    return utils.selectCells(startCell, endCell, startCell);
                }
                grid.getActiveRows = (): number[] => {
                    return grid.variables._activeRows;
                }
                grid.getActiveCols = (): string[] => {
                    const colIds: string[] = [];
                    grid.variables._activeCols.forEach((colIndex: number) => {
                        colIds.push(grid.__getColInfo(colIndex).cId);
                    });
                    return colIds;
                }
                grid.getActiveRange = (): {
                    startRow: number | null;
                    startColId : string | null;
                    endRow : number | null;
                    endColId : string | null;
                } => {
                    const range = {
                        startRow : null,
                        startColId : null,
                        endRow : null,
                        endColId : null,
                    };
                    const activeCells = grid.variables._activeCells;
                    if (activeCells.length > 0) {
                    range.startRow = activeCells[0].row; 
                    range.startColId = activeCells[0].cId; 
                    range.endRow = activeCells[activeCells.length - 1].row; 
                    range.endColId = activeCells[activeCells.length - 1].cId; 
                    }
                    return range;
                }
                grid.editCell = (row: number, colIndexOrColId: number | string): boolean => {
                    grid.__checkRowIndex(row);
                    const colIndex = grid.__getColIndex(colIndexOrColId, true);
                    grid.__checkColIndex(colIndex);
                    grid.__checkColRownumOrStatus(colIndex);
                    const cell = grid._getCell(row, colIndexOrColId);
                    if (['select','checkbox','button','link'].indexOf(cell.cDataType) >= 0) return false;
                    if (!grid.setTargetCell(row, colIndexOrColId)) return false;
                    utils.createGridEditor(cell);
                    return true;
                }
                grid.redo = (): boolean => {
                    return utils.redoundo(gId);
                }
                grid.undo = (): boolean => {
                    return utils.redoundo(gId, false);
                }
                grid._getDataTypeStyle = () => {
                    const dataTypeStyle = {};
                    Object.keys(vg.dataType).forEach((key) => {
                        if(vg.dataType[key].cellStyle) {
                            (dataTypeStyle as any)[key] = vg.dataType[key].cellStyle;
                        }
                    });
                    return dataTypeStyle;
                }
                grid._getFilterSpan = () => {
                    return vg.filterSpan;
                }
                grid._getFooterFormula = () => {
                    return utils.deepCopy(vg.footerFormula);
                }
                /*
                grid.removeGridMethod = () => {
                    delete window[gId];
                };
                */
                grid._getHeader = () => {
                    return gridHeader;
                };
                grid._getBody = () => {
                    return gridBody;
                };
                grid._getFooter = () => {
                    return gridFooter;
                };
                grid.__loadHeader();
                grid.__loadFooter();

                const gridFunc: GridMethods = {} as unknown as GridMethods;
                Object.keys(grid).forEach(key => {
                    if (typeof grid[key] === 'function' && !key.startsWith('__')) {
                        (gridFunc as any)[key] = (...param: any[]) => {
                            return grid[key](...param);
                        }
                    }
                });
                utils.deepFreeze(gridFunc);
                (window as any)[gId] = gridFunc;
                GRIDS[gId] = gridFunc;
                
                grid.variables = {};
                grid.variables._activeRows = [];
                grid.variables._activeCols = [];
                grid.variables._activeCells = [];
                grid.variables._targetCell = null;
                grid.variables._recodes = [];
                grid.variables._recodeseq = 0;
                grid.variables._sortToggle = {};
                grid.variables._filters = [];
                grid.variables._isDrawable = true;

                gridHeader.addEventListener('dblclick', function (e: any) {
                    if (utils.onHeaderDragging) return;
                    let headerCell;
                    if (e.target.gType === 'ghd') {
                        headerCell = e.target;
                    }
                    else if (e.target.gType === 'sort'){
                        headerCell = e.target.parentNode;
                    }
                    else {
                        return;
                    }
                    if (utils.doEventWithCheckChanged(headerCell.gId, '_onBeforeDblClickHeader', headerCell.row, headerCell.cId) === false) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                    if (e.target.cDataType === 'checkbox' && grid.info.gAllCheckable && headerCell.isLastCell) {
                        grid.setColSameValue(e.target.cIndex, !utils.getCheckboxCellTrueOrFalse(grid._getCell(1, e.target.cIndex)), true);
                        return;
                    }

                    if (!grid.info.gSortable) return;
                    if (!grid.__getColInfo(headerCell.cId).cSortable) return;
                    if (!headerCell.isLastCell) return;
                    
                    grid.sort(headerCell.cId, !grid.variables._sortToggle[headerCell.cId]);
                    
                    const removeSpans = headerCell.parentNode.querySelectorAll('.' + headerCell.gId + '_sortSpan');
                    removeSpans.forEach((el: any) => {
                        el.parentNode.removeChild(el);
                    });
                    let sortSpan: any;
                    if(grid.variables._sortToggle[headerCell.cId]) {
                        if(vg.sortAscSpan && vg.sortAscSpan instanceof HTMLElement && vg.sortAscSpan.nodeType === 1) {
                            sortSpan = vg.sortAscSpan.cloneNode(true);
                        }
                        else {
                            sortSpan = document.createElement('span');
                            sortSpan.style.fontSize = '0.5em';
                            sortSpan.style.paddingLeft = '5px';
                            sortSpan.innerText = '▲';
                        }
                    }
                    else {
                        if(vg.sortDescSpan && vg.sortDescSpan instanceof HTMLElement && vg.sortDescSpan.nodeType === 1) {
                            sortSpan = vg.sortDescSpan.cloneNode(true);
                        }
                        else {
                            sortSpan = document.createElement('span');
                            sortSpan.style.fontSize = '0.5em';
                            sortSpan.style.paddingLeft = '5px';
                            sortSpan.innerText = '▼';
                        }
                    }
                    sortSpan.gId = headerCell.gId;
                    sortSpan.isChild = true;
                    sortSpan.gType = 'sort';
                    sortSpan.classList.add(headerCell.gId + '_sortSpan');
                    sortSpan.classList.add(grid.variables._sortToggle[headerCell.cId] ? headerCell.gId + '_ascSpan' : headerCell.gId + '_descSpan');
                    headerCell.append(sortSpan);

                    utils.doEventWithCheckChanged(headerCell.gId, '_onAfterDblClickHeader', headerCell.row, headerCell.cId);
                });
                gridHeader.addEventListener('click', function (e: any) {
                    let headerCell;
                    if (e.target.gType === 'ghd') {
                        headerCell = e.target;
                        if (utils.doEventWithCheckChanged(headerCell.gId, '_onBeforeClickHeader', headerCell.row, headerCell.cId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        utils.doEventWithCheckChanged(headerCell.gId, '_onAfterClickHeader', headerCell.row, headerCell.cId)
                    }
                    else if (e.target.gType === 'filter'){
                        headerCell = e.target.parentNode;
                        if (utils.doEventWithCheckChanged(headerCell.gId, '_onClickFilter', headerCell.row, headerCell.cId, e.target) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                        const removeSpans = headerCell.parentNode.querySelectorAll('.' + headerCell.gId + '_filterSelect');
                        const filterSelect = e.target.querySelectorAll('.' + headerCell.gId + '_filterSelect')[0];
                        removeSpans.forEach((el: any) => {
                            if (filterSelect !== el && el.value === 'ALL') el.style.display = 'none';
                        });
                        if (filterSelect.style.display === 'none') {
                            filterSelect.style.display = 'block';
                        }
                        else {
                            filterSelect.style.display = 'none';
                        }
                    }
                });
                gridBody.addEventListener('mousemove', function (e) {
                    if (utils.isDragging) {
                        utils.mouseX = e.clientX;
                        utils.mouseY = e.clientY;
                    }
                });
                gridBody.addEventListener('mouseleave',function (e: any) {
                    if (utils.isDragging) {
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;
                        
                        const deltaX = mouseX - utils.mouseX;
                        const deltaY = mouseY - utils.mouseY;
                        
                        let direction = '';

                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            
                            direction = deltaX > 0 ? 'right' : 'left';
                        } else {
                            
                            direction = deltaY > 0 ? 'down' : 'up';
                        }
                        utils.startScrolling(e.target.gId, direction);
                    }
                });
                gridBody.addEventListener('mouseenter', function (e) {
                    if (utils.scrollInterval) {
                        utils.stopScrolling();
                    }
                });
                gridBody.addEventListener('dblclick', function (e: any) {
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (cell.gType !== 'gbd') return;
                    if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeDblClickCell', cell.row, cell.cId) === false) return;
                    if (['select','checkbox','button','link'].indexOf(cell.cDataType) >= 0) return;
                    utils.createGridEditor(cell);
                    utils.doEventWithCheckChanged(cell.gId, '_onAfterDblClickCell', cell.row, cell.cId)
                });
                grid.addEventListener('click', function (e: any) {
                    if (!e.target.gType) return;
                    let cell
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (!cell) return;
                    if (cell.cUntarget || cell.gType !== 'gbd') {
                        return;
                    }
                    if(cell.firstChild && cell.firstChild.nType !== 'select') {
                        if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeClickCell', cell.row, cell.cId) === false) {
                            e.stopPropagation();
                            e.preventDefault();
                            return;
                        }
                    }
                    if (e.target.nType) {
                        switch (e.target.nType) {
                            case 'checkbox':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickCheckbox', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = e.target.parentNode.cValue;
                                break;
                            case 'button':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickButton', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                break;
                            case 'link':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickLink', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.cDataType === key) {
                            if(vg.dataType[key].onClick) {
                                if(typeof vg.dataType[key].onClick !== 'function') throw new Error('onClick must be a function.');
                                if((vg.dataType as any)[key].onClick(e, grid.__getData(cell)) === false) {
                                    return;
                                }
                            }
                        }
                    });
                    utils.doEventWithCheckChanged(cell.gId, '_onAfterClickCell', cell.row, cell.cId);
                })
                grid.addEventListener('mousedown', function (e: any) {
                    if (!e.target.gType) return;
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else {
                        cell = e.target;
                    }
                    if (cell.cUntarget || cell.gType !== 'gbd') {
                        return;
                    }
                    if (e.target.nType) {
                        switch (e.target.nType) {
                            case 'select':
                                if (utils.doEventWithCheckChanged(cell.gId, '_onBeforeClickCell', cell.row, cell.cId) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                if (utils.doEventWithCheckChanged(cell.gId, '_onClickSelect', cell.row, cell.cId, e.target) === false) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = e.target.value;
                                break;
                            default:
                                break;
                        }
                    }
                    Object.keys(vg.dataType).forEach((key) => {
                        if(cell.cDataType === key) {
                            if(vg.dataType[key].onMousedown) {
                                if(typeof vg.dataType[key].onMousedown !== 'function') throw new Error('onMousedown must be a function.');
                                if((vg.dataType as any)[key].onMousedown(e, grid.__getData(cell)) === false) {
                                    return;
                                }
                            }
                        }
                    });
                    utils.activeGrid = this;
                    utils.isDragging = true;
                    if (this.info.gSelectionPolicy === 'range' && e.shiftKey && this.variables._targetCell) {
                        utils.unselectCells(this.gId);
                        utils.selectCells(this.variables._targetCell, cell);
                    }
                    else {
                        utils.selectCell(cell);
                    }
                });
                grid.addEventListener('mousemove', function (e: any) {
                    let cell;
                    if (e.target.gType === 'gbdv') {
                        cell = e.target.parentNode;
                    }
                    else if (e.target.gType === 'gbd'){
                        cell = e.target;
                    }
                    if (!cell) return;

                    if (this.info.gSelectionPolicy !== 'range') return;
                    if (utils.mouseoverCell === cell) return;
                    utils.mouseoverCell = cell;
                    
                    if (utils.isDragging && this.variables._targetCell) {
                        
                        utils.unselectCells(this.gId);
                        utils.selectCells(this.variables._targetCell, cell);
                    }
                });
                grid.addEventListener('mouseleave', function (e: any) {
                    if (this.info.gSelectionPolicy !== 'range') return;
                    utils.mouseoverCell = null;

                    if (utils.isDragging) {
                        utils.isDragging = false;
                    }
                });
                (utils as any)[gId] = grid;
                grid.append(gridHeader);
                grid.append(gridBody);
                grid.append(gridFooter);
                vanillagrid.append(grid);

                grid.events = {}
                if ((window as any)[gId + '_onActiveCell']) {
                    grid.events[gId + '_onActiveCell'] = (window as any)[gId + '_onActiveCell'];
                }
                else {
                    (window as any)[gId + '_onActiveCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onActiveCell'] = (window as any)[gId + '_onActiveCell'];
                }
                if ((window as any)[gId + '_onActiveCells']) {
                    grid.events[gId + '_onActiveCells'] = (window as any)[gId + '_onActiveCells'];
                }
                else {
                    (window as any)[gId + '_onActiveCells'] = (startRow: number, startColId: string, endRow: number, endColId: string) => {return true};
                    grid.events[gId + '_onActiveCells'] = (window as any)[gId + '_onActiveCells'];
                }
                if ((window as any)[gId + '_onActiveRow']) {
                    grid.events[gId + '_onActiveRow'] = (window as any)[gId + '_onActiveRow'];
                }
                else {
                    (window as any)[gId + '_onActiveRow'] = (row: number) => {return true};
                    grid.events[gId + '_onActiveRow'] = (window as any)[gId + '_onActiveRow'];
                }
                if ((window as any)[gId + '_onActiveRows']) {
                    grid.events[gId + '_onActiveRows'] = (window as any)[gId + '_onActiveRows'];
                }
                else {
                    (window as any)[gId + '_onActiveRows'] = (startRow: number, endRow: number) => {return true};
                    grid.events[gId + '_onActiveRows'] = (window as any)[gId + '_onActiveRows'];
                }
                if ((window as any)[gId + '_onActiveCol']) {
                    grid.events[gId + '_onActiveCol'] = (window as any)[gId + '_onActiveCol'];
                }
                else {
                    (window as any)[gId + '_onActiveCol'] = (colId: string) => {return true};
                    grid.events[gId + '_onActiveCol'] = (window as any)[gId + '_onActiveCol'];
                }
                if ((window as any)[gId + '_onActiveCols']) {
                    grid.events[gId + '_onActiveCols'] = (window as any)[gId + '_onActiveCols'];
                }
                else {
                    (window as any)[gId + '_onActiveCols'] = (startColId: string, endColId: string) => {return true};
                    grid.events[gId + '_onActiveCols'] = (window as any)[gId + '_onActiveCols'];
                }
                if ((window as any)[gId + '_onBeforeChange']) {
                    grid.events[gId + '_onBeforeChange'] = (window as any)[gId + '_onBeforeChange'];
                }
                else {
                    (window as any)[gId + '_onBeforeChange'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onBeforeChange'] = (window as any)[gId + '_onBeforeChange'];
                }
                if ((window as any)[gId + '_onAfterChange']) {
                    grid.events[gId + '_onAfterChange'] = (window as any)[gId + '_onAfterChange'];
                }
                else {
                    (window as any)[gId + '_onAfterChange'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onAfterChange'] = (window as any)[gId + '_onAfterChange'];
                }
                if ((window as any)[gId + '_onBeforeClickCell']) {
                    grid.events[gId + '_onBeforeClickCell'] = (window as any)[gId + '_onBeforeClickCell'];
                }
                else {
                    (window as any)[gId + '_onBeforeClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeClickCell'] = (window as any)[gId + '_onBeforeClickCell'];
                }
                if ((window as any)[gId + '_onAfterClickCell']) {
                    grid.events[gId + '_onAfterClickCell'] = (window as any)[gId + '_onAfterClickCell'];
                }
                else {
                    (window as any)[gId + '_onAfterClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterClickCell'] = (window as any)[gId + '_onAfterClickCell'];
                }
                if ((window as any)[gId + '_onClickSelect']) {
                    grid.events[gId + '_onClickSelect'] = (window as any)[gId + '_onClickSelect'];
                }
                else {
                    (window as any)[gId + '_onClickSelect'] = (row: number, colId: string, selectNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickSelect'] = (window as any)[gId + '_onClickSelect'];
                }
                if ((window as any)[gId + '_onClickCheckbox']) {
                    grid.events[gId + '_onClickCheckbox'] = (window as any)[gId + '_onClickCheckbox'];
                }
                else {
                    (window as any)[gId + '_onClickCheckbox'] = (row: number, colId: string, checkboxNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickCheckbox'] = (window as any)[gId + '_onClickCheckbox'];
                }
                if ((window as any)[gId + '_onClickButton']) {
                    grid.events[gId + '_onClickButton'] = (window as any)[gId + '_onClickButton'];
                }
                else {
                    (window as any)[gId + '_onClickButton'] = (row: number, colId: string, buttonNude: HTMLElement) => {return true};
                    grid.events[gId + '_onClickButton'] = (window as any)[gId + '_onClickButton'];
                }
                if ((window as any)[gId + '_onClickLink']) {
                    grid.events[gId + '_onClickLink'] = (window as any)[gId + '_onClickLink'];
                }
                else {
                    (window as any)[gId + '_onClickLink'] = (row: number, colId: string, linkNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickLink'] = (window as any)[gId + '_onClickLink'];
                }
                if ((window as any)[gId + '_onBeforeDblClickCell']) {
                    grid.events[gId + '_onBeforeDblClickCell'] = (window as any)[gId + '_onBeforeDblClickCell'];
                }
                else {
                    (window as any)[gId + '_onBeforeDblClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeDblClickCell'] = (window as any)[gId + '_onBeforeDblClickCell'];
                }
                if ((window as any)[gId + '_onAfterDblClickCell']) {
                    grid.events[gId + '_onAfterDblClickCell'] = (window as any)[gId + '_onAfterDblClickCell'];
                }
                else {
                    (window as any)[gId + '_onAfterDblClickCell'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterDblClickCell'] = (window as any)[gId + '_onAfterDblClickCell'];
                }
                if ((window as any)[gId + '_onBeforeClickHeader']) {
                    grid.events[gId + '_onBeforeClickHeader'] = (window as any)[gId + '_onBeforeClickHeader'];
                }
                else {
                    (window as any)[gId + '_onBeforeClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeClickHeader'] = (window as any)[gId + '_onBeforeClickHeader'];
                }
                if ((window as any)[gId + '_onAfterClickHeader']) {
                    grid.events[gId + '_onAfterClickHeader'] = (window as any)[gId + '_onAfterClickHeader'];
                }
                else {
                    (window as any)[gId + '_onAfterClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterClickHeader'] = (window as any)[gId + '_onAfterClickHeader'];
                }
                if ((window as any)[gId + '_onBeforeDblClickHeader']) {
                    grid.events[gId + '_onBeforeDblClickHeader'] = (window as any)[gId + '_onBeforeDblClickHeader'];
                }
                else {
                    (window as any)[gId + '_onBeforeDblClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onBeforeDblClickHeader'] = (window as any)[gId + '_onBeforeDblClickHeader'];
                }
                if ((window as any)[gId + '_onAfterDblClickHeader']) {
                    grid.events[gId + '_onAfterDblClickHeader'] = (window as any)[gId + '_onAfterDblClickHeader'];
                }
                else {
                    (window as any)[gId + '_onAfterDblClickHeader'] = (row: number, colId: string) => {return true};
                    grid.events[gId + '_onAfterDblClickHeader'] = (window as any)[gId + '_onAfterDblClickHeader'];
                }
                if ((window as any)[gId + '_onEditEnter']) {
                    grid.events[gId + '_onEditEnter'] = (window as any)[gId + '_onEditEnter'];
                }
                else {
                    (window as any)[gId + '_onEditEnter'] = (row: number, colId: string, editorNode: HTMLElement) => {return true};
                    grid.events[gId + '_onEditEnter'] = (window as any)[gId + '_onEditEnter'];
                }
                if ((window as any)[gId + '_onEditEnding']) {
                    grid.events[gId + '_onEditEnding'] = (window as any)[gId + '_onEditEnding'];
                }
                else {
                    (window as any)[gId + '_onEditEnding'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onEditEnding'] = (window as any)[gId + '_onEditEnding'];
                }
                if ((window as any)[gId + '_onClickFilter']) {
                    grid.events[gId + '_onClickFilter'] = (window as any)[gId + '_onClickFilter'];
                }
                else {
                    (window as any)[gId + '_onClickFilter'] = (row: number, colId: string, filterNode: HTMLElement) => {return true};
                    grid.events[gId + '_onClickFilter'] = (window as any)[gId + '_onClickFilter'];
                }
                if ((window as any)[gId + '_onChooseFilter']) {
                    grid.events[gId + '_onChooseFilter'] = (window as any)[gId + '_onChooseFilter'];
                }
                else {
                    (window as any)[gId + '_onChooseFilter'] = (row: number, colId: string, oldValue: any, newValue: any) => {return true};
                    grid.events[gId + '_onChooseFilter'] = (window as any)[gId + '_onChooseFilter'];
                }
                if ((window as any)[gId + '_onPaste']) {
                    grid.events[gId + '_onPaste'] = (window as any)[gId + '_onPaste'];
                }
                else {
                    (window as any)[gId + '_onPaste'] = (startRow: number, startColId: string, clipboardText: string) => {return true};
                    grid.events[gId + '_onPaste'] = (window as any)[gId + '_onPaste'];
                }
                if ((window as any)[gId + '_onCopy']) {
                    grid.events[gId + '_onCopy'] = (window as any)[gId + '_onCopy'];
                }
                else {
                    (window as any)[gId + '_onCopy'] = (startRow: number, startColId: string, endRow: number, endColId: string) => {return true};
                    grid.events[gId + '_onCopy'] = (window as any)[gId + '_onCopy'];
                }
                if ((window as any)[gId + '_onResize']) {
                    grid.events[gId + '_onResize'] = (window as any)[gId + '_onResize'];
                }
                else {
                    (window as any)[gId + '_onResize'] = (colId: string) => {return true};
                    grid.events[gId + '_onResize'] = (window as any)[gId + '_onResize'];
                }
                if ((window as any)[gId + '_onKeydownEditor']) {
                    grid.events[gId + '_onKeydownEditor'] = (window as any)[gId + '_onKeydownEditor'];
                }
                else {
                    (window as any)[gId + '_onKeydownEditor'] = (event: KeyboardEvent) => {return true};
                    grid.events[gId + '_onKeydownEditor'] = (window as any)[gId + '_onKeydownEditor'];
                }
                if ((window as any)[gId + '_onInputEditor']) {
                    grid.events[gId + '_onInputEditor'] = (window as any)[gId + '_onInputEditor'];
                }
                else {
                    (window as any)[gId + '_onInputEditor'] = (event: InputEvent) => {return true};
                    grid.events[gId + '_onInputEditor'] = (window as any)[gId + '_onInputEditor'];
                }
                if ((window as any)[gId + '_onKeydownGrid']) {
                    grid.events[gId + '_onKeydownGrid'] = (window as any)[gId + '_onKeydownGrid'];
                }
                else {
                    (window as any)[gId + '_onKeydownGrid'] = (event: KeyboardEvent) => {return true};
                    grid.events[gId + '_onKeydownGrid'] = (window as any)[gId + '_onKeydownGrid'];
                }
                Object.freeze(grid.events);
                
                grid._getGridCssStyle = () => {
                    const csses: any = {};
                    csses['.' + gId + '_vanillagrid'] = {
                        'width': grid.cssInfo.width,
                        'height': grid.cssInfo.height,
                        'display': grid.info.gVisible ? 'block' : 'none',
                        'border': '1px solid ' + grid.cssInfo.gridBorderColor,
                        'overflow': 'auto',
                        'background-color': '#fff',
                        'margin': grid.cssInfo.margin,
                        'padding': grid.cssInfo.padding,
                        'font-family': grid.cssInfo.gridFontFamily,
                    };
                    csses['.' + gId + '_v-g'] = {
                        'background-color': grid.cssInfo.bodyBackColor,
                        'display': 'flex',
                        'position': 'relative',
                        'flex-direction': 'column',
                        'height': '100%',
                        'overflow-x': 'auto',
                        'overflow-y': 'auto',
                        '-webkit-user-select': 'none',
                        '-moz-user-select': 'none',
                        '-ms-user-select': 'none',
                        'user-select': 'none',
                    };
                    csses['.' + gId + '_v-g-h'] = {
                        //'position': '-webkit-sticky',
                        'position': 'sticky',
                        'top': '0',
                        'z-index': '250',
                        'display': grid.info.gHeaderVisible ? 'grid' : 'none',
                    };
                    csses['.' + gId + '_v-g-b'] = {
                        'margin-bottom': '22px',
                        'display': 'grid',
                        'position': 'relative',
                    };
                    csses['.' + gId + '_v-g-f'] = {
                        //'position': '-webkit-sticky',
                        'position': 'sticky',
                        'bottom': '0',
                        'z-index': '250',
                        'display': 'grid',
                        'margin-top': 'auto',
                    };
                    csses['.' + gId + '_h-v-g-d'] = {
                        'background-color': grid.cssInfo.headerCellBackColor,
                        'justify-content': 'center',
                        'text-align': 'center',
                        'align-items' : grid.cssInfo.verticalAlign,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.headerCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.headerCellBorderColor,
                        'color': grid.cssInfo.headerCellFontColor,
                    };
                    csses['.' + gId + '_h-v-g-d select'] = {
                        'color': '#333',
                    };
                    csses['.' + gId + '_h-v-g-d option'] = {
                        'color': '#333',
                    };
                    csses['.' + gId + '_b-v-g-d'] = {
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.bodyCellBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.bodyCellFontColor,
                    };
                    csses['.' + gId + '_f-v-g-d'] = {
                        'justify-content': 'center',
                        'text-align': 'center',
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.footerCellBackColor,
                        'border-top': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.footerCellBorderColor,
                        'color': grid.cssInfo.footerCellFontColor,
                    };
                    csses['.' + gId + '_f-v-g-d-value'] = {
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                    };
                    csses['.' + gId + '_b-v-g-d-alter'] = {
                        'align-items' : grid.cssInfo.verticalAlign,
                        'background-color': grid.cssInfo.alterRowBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.alterRowFontColor,
                    };
                    csses['.' + gId + '_b-v-g-d-locked'] = {
                        'background-color': grid.cssInfo.lockCellBackColor,
                        'border-bottom': grid.cssInfo.horizenBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'border-right': grid.cssInfo.verticalBorderSize + 'px solid ' + grid.cssInfo.bodyCellBorderColor,
                        'color': grid.cssInfo.lockCellFontColor,
                    };
                    csses['.' + gId + '_v-g-d'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'display': 'flex',
                        'min-height': grid.cssInfo.cellMinHeight,
                        'overflow': 'hidden',
                        'white-space': 'nowrap',
                        'padding-left': '5px',
                        'padding-right': '5px',
                    };
                    if (grid.cssInfo.overflowWrap) csses['.' + gId + '_v-g-d']['overflow-wrap'] = grid.cssInfo.overflowWrap;
                    if (grid.cssInfo.wordBreak) csses['.' + gId + '_v-g-d']['word-break'] = grid.cssInfo.wordBreak;
                    if (grid.cssInfo.whiteSpace) csses['.' + gId + '_v-g-d']['white-space'] = grid.cssInfo.whiteSpace;

                    csses['.' + gId + '_editor'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'background-color': grid.cssInfo.editorBackColor,
                        'border': 'none',
                        'color': grid.cssInfo.editorFontColor,
                        'overflow' : 'hidden',
                        'resize': 'none',
                        'box-sizing': 'border-box',
                        'font-family': grid.cssInfo.gridFontFamily,
                        'text-align': 'inherit',
                    };
                    csses['.' + gId + '_editor:focus'] = {
                        'outline': 'none',
                    };
                    csses['.' + gId + '_mouseover-cell'] = {
                        'background-color': grid.cssInfo.mouseoverCellBackColor + ' !important',
                        'color': grid.cssInfo.mouseoverCellFontColor + ' !important',
                    };
                    csses['.' + gId + '_selected-cell'] = {
                        'background-color': grid.cssInfo.selectCellBackColor + ' !important',
                        'color': grid.cssInfo.selectCellFontColor + ' !important',
                    };
                    csses['.' + gId + '_selected-col'] = {
                        'background-color': grid.cssInfo.selectColBackColor,
                        'color': grid.cssInfo.selectColFontColor,
                    };
                    csses['.' + gId + '_selected-row'] = {
                        'background-color': grid.cssInfo.selectRowBackColor,
                        'color': grid.cssInfo.selectRowFontColor,
                    };
                    csses['.' + gId + '_filterSpan'] = {
                        'display': 'block',
                        'font-size': '0.8em',
                        'padding-right': '8px',
                        'cursor': 'pointer',
                    };
                    csses['.' + gId + '_filterSelect'] = {
                        'position': 'absolute',
                        'z-index': '300',
                        'margin': '5px',
                    };
                    csses['.' + gId + '_data-value-select'] = {
                        'font-size': grid.cssInfo.cellFontSize,
                        'cursor': 'pointer',
                        'border': 'none',
                        'background': 'none',
                        'color': 'inherit'
                    }
                    csses['.' + gId + '_data-value-select:focus'] = {
                        'outline': 'none',
                    }
                    csses['.' + gId + '_data-value-checkbox'] = {
                        'cursor': 'pointer',
                    }
                    csses['.' + gId + '_data-value-button'] = {
                        'min-width': '95%',
                        'height': (utils.extractNumberAndUnit(grid.cssInfo.cellMinHeight).number * 0.85) + 'px',
                        'line-height': (utils.extractNumberAndUnit(grid.cssInfo.cellMinHeight).number * 0.85) + 'px',
                        'font-size': grid.cssInfo.cellFontSize,
                        'cursor': 'pointer',
                        'border': 'none',
                        'color': grid.cssInfo.buttonFontColor,
                        'background-color': grid.cssInfo.buttonBackColor,
                        'box-shadow': '0.75px 0.75px 1px 0.25px ' + grid.cssInfo.buttonBorderColor,
                    }
                    csses['.' + gId + '_data-value-button:hover'] = {
                        'color': grid.cssInfo.buttonHoverFontColor,
                        'background-color': grid.cssInfo.buttonHoverBackColor,
                    }
                    csses['.' + gId + '_data-value-button:active'] = {
                        'color': grid.cssInfo.buttonActiveFontColor,
                        'background-color': grid.cssInfo.buttonActiveBackColor,
                        'box-shadow': '0px 0px 0.5px 0.25px ' + grid.cssInfo.buttonBorderColor,
                    }
                    csses['.' + gId + '_data-value-button:focus'] = {
                        'outline': 'none',
                    }
                    csses['.' + gId + '_data-value-button:disabled'] = {
                        'opacity': '0.7',
                    }
                    csses['.' + gId + '_data-value-link'] = {
                        'color': grid.cssInfo.linkFontColor,
                        'text-decoration': grid.cssInfo.linkHasUnderLine ? 'underline' : 'none',
                    }
                    csses['.' + gId + '_data-value-link:visited'] = {
                        'color': grid.cssInfo.linkVisitedFontColor,
                    }
                    csses['.' + gId + '_data-value-link:hover'] = {
                        'color': grid.cssInfo.linkHoverFontColor + ' !important',
                    }
                    csses['.' + gId + '_data-value-link:active'] = {
                        'color': grid.cssInfo.linkActiveFontColor + ' !important',
                    }
                    csses['.' + gId + '_data-value-link:focus'] = {
                        'color': grid.cssInfo.linkFocusFontColor + ' !important',
                    }
                    return csses;
                }

                grid._setGridCssStyle = () => {
                    let cssText = '';
                    const csses = grid._getGridCssStyle();
                    const cssKeys = Object.keys(csses);
                    for(let i = 0; i < cssKeys.length; i++) {
                        cssText = cssText + cssKeys[i] + ' {' + utils.getCssTextFromObject(csses[cssKeys[i]]) + '}\n';
                    }

                    let styleElement: any = document.getElementById(gId + '_styles-sheet');
                    if (styleElement) {
                        utils.removeAllChild(styleElement);
                        styleElement.appendChild(document.createTextNode(cssText));
                    }
                    else {
                        styleElement = document.createElement('style');
                        styleElement.setAttribute('id', gId + '_styles-sheet');
                        if (styleElement.styleSheet) {
                            styleElement.styleSheet.cssText = cssText;
                        }
                        else {
                            styleElement.appendChild(document.createTextNode(cssText));
                        }
                        document.getElementsByTagName('head')[0].appendChild(styleElement);
                    }
                }

                grid._setGridCssStyle();
            }
            vg._docEvent_mousedown = function (e: any) {
                
                if (utils.activeGridEditor && utils.activeGridEditor !== e.target) {
                    utils.modifyCell();
                }
                
                if (utils.activeGrid && !(utils as any).activeGrid.contains(e.target)) {
                    utils.activeGrid = null;
                }
            };
            document.removeEventListener('mousedown', vg._docEvent_mousedown);
            document.addEventListener('mousedown', vg._docEvent_mousedown);
            
            vg._docEvent_mouseup = function (e: any) {
                
                utils.mouseX = 0;
                utils.mouseY = 0;
                utils.stopScrolling();

                if (utils.isDragging) {
                    utils.isDragging = false;
                }
                if (utils.isHeaderDragging) {
                    utils.isHeaderDragging = false;
                }
            }
            document.removeEventListener('mouseup', vg._docEvent_mouseup);
            document.addEventListener('mouseup', vg._docEvent_mouseup);
            
            vg._docEvent_keydown = function (e: any) {
                if (utils.activeGrid && !utils.activeGridEditor) {
                    const _grid: any = utils.activeGrid; 
                    const gId = _grid.gId;
                    if (utils.doEventWithCheckChanged(gId, '_onKeydownGrid', e) === false) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                    
                    if (e.ctrlKey || e.metaKey) {
                        switch (e.key) {
                            case 'z':
                            case 'Z': 
                                utils.redoundo(gId);
                                e.preventDefault();
                                break;
                            case 'y':
                            case 'Y': 
                                utils.redoundo(gId, false);
                                e.preventDefault();
                                break;
                            case 'a':
                            case 'A': 
                                _grid.variables._targetCell = _grid._getCell(1,3);
                                utils.selectCells(_grid._getCell(1,1),_grid._getCell(_grid.getRowCount(), _grid.getColCount()));
                                e.preventDefault();
                                break;
                            default:
                                break;
                        }
                    }
                    if (_grid.info.gSelectionPolicy === 'none' || _grid.variables._activeCells.length <= 0) return;
                    const startCell = _grid.variables._activeCells[0];
                    const endCell = _grid.variables._activeCells[_grid.variables._activeCells.length - 1];
                    let newTargetCell: Cell;
                    Object.keys(vg.dataType).forEach((key) => {
                        if(_grid.variables._targetCell.cDataType === key) {
                            if(vg.dataType[key].onSelectedAndKeyDown) {
                                if(typeof vg.dataType[key].onSelectedAndKeyDown !== 'function') throw new Error('onSelectedAndKeyDown must be a function.');
                                if(vg.dataType[key].onSelectedAndKeyDown(e, _grid.__getData(_grid.variables._targetCell)) === false) {
                                    return;
                                }
                            }
                        }
                    });
                    switch (e.key) {
                        case 'Tab':
                            newTargetCell = utils.getTabCell(_grid.variables._targetCell, e.shiftKey)!;
                            utils.selectCell(newTargetCell);
                            e.preventDefault();
                            break;
                        case 'F2':
                            utils.createGridEditor(_grid.variables._targetCell);
                            e.preventDefault();
                            break;
                        case 'Enter':
                            if (_grid.variables._targetCell.cDataType === 'select') {
                                utils.editOldValue = _grid.variables._targetCell.firstChild.value;
                                _grid.variables._targetCell.firstChild.focus();
                            }
                            else if (_grid.variables._targetCell.cDataType === 'checkbox') {
                                utils.editOldValue = _grid.variables._targetCell.cValue;
                                _grid.variables._targetCell.firstChild.checked = !_grid.variables._targetCell.firstChild.checked;
                                utils.selectAndCheckboxOnChange(_grid.variables._targetCell.firstChild);
                                
                                newTargetCell = utils.getMoveRowCell(_grid.variables._targetCell, 1)!;
                                utils.selectCell(newTargetCell);
                                e.preventDefault();
                            }
                            else if (['text','number','date','month','mask','code'].indexOf(_grid.variables._targetCell.cDataType) >= 0) {
                                utils.createGridEditor(_grid.variables._targetCell, true);
                                e.preventDefault();
                            }
                            break;
                        case ' ':
                            if (_grid.variables._targetCell.cDataType === 'select') {
                                if (_grid.variables._targetCell.cUntarget || _grid.variables._targetCell.cLocked) {
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = _grid.variables._targetCell.firstChild.value;
                                _grid.variables._targetCell.firstChild.focus();
                            }
                            else if (_grid.variables._targetCell.cDataType === 'button') {
                                _grid.variables._targetCell.firstChild.focus();
                            }
                            else if (_grid.variables._targetCell.cDataType === 'checkbox') {
                                if (_grid.variables._targetCell.cUntarget || _grid.variables._targetCell.cLocked) {
                                    e.preventDefault();
                                    return;
                                }
                                utils.editOldValue = _grid.variables._targetCell.cValue;
                                _grid.variables._targetCell.firstChild.checked = !_grid.variables._targetCell.firstChild.checked;
                                utils.selectAndCheckboxOnChange(_grid.variables._targetCell.firstChild);
                                e.preventDefault();
                            }
                            else if (['text','number','date','month','mask','code'].indexOf(_grid.variables._targetCell.cDataType) >= 0) {
                                utils.createGridEditor(_grid.variables._targetCell);
                                e.preventDefault();
                            }
                            break;
                        case 'ArrowUp':
                            if (_grid.info.gSelectionPolicy === 'range' && e.shiftKey) {
                                utils.unselectCells(gId);
                                if (_grid.variables._targetCell.row >= endCell.row) {
                                    newTargetCell = utils.getMoveRowCell(startCell, -1)!;
                                    utils.selectCells(newTargetCell, endCell, newTargetCell);
                                }
                                else {
                                    newTargetCell = utils.getMoveRowCell(endCell, -1)!;
                                    utils.selectCells(startCell, newTargetCell);
                                }
                            }
                            else {
                                newTargetCell = utils.getMoveRowCell(_grid.variables._targetCell, -1)!;
                                utils.selectCell(newTargetCell);
                            }
                            e.preventDefault();
                            break;
                        case 'ArrowDown':
                            if (_grid.info.gSelectionPolicy === 'range' && e.shiftKey) {
                                utils.unselectCells(gId);
                                if (_grid.variables._targetCell.row <= startCell.row) {
                                    newTargetCell = utils.getMoveRowCell(endCell, 1)!;
                                    utils.selectCells(startCell, newTargetCell);
                                }
                                else {
                                    newTargetCell = utils.getMoveRowCell(startCell, 1)!;
                                    utils.selectCells(newTargetCell, endCell, newTargetCell);
                                }
                            }
                            else {
                                newTargetCell = utils.getMoveRowCell(_grid.variables._targetCell, 1)!;
                                utils.selectCell( newTargetCell);
                            }
                            e.preventDefault();
                            break;
                        case 'ArrowLeft':
                            if (_grid.info.gSelectionPolicy === 'range' && e.shiftKey) {
                                utils.unselectCells(gId);
                                if (_grid.variables._targetCell.col >= endCell.col) {
                                    newTargetCell = utils.getMoveColCell(startCell, -1)!;
                                    utils.selectCells(newTargetCell, endCell, newTargetCell);
                                }
                                else {
                                    newTargetCell = utils.getMoveColCell(endCell, -1)!;
                                    utils.selectCells(startCell, newTargetCell);
                                }
                            }
                            else {
                                newTargetCell = utils.getMoveColCell(_grid.variables._targetCell, -1)!;
                                utils.selectCell(newTargetCell);
                            }
                            e.preventDefault();
                            break;
                        case 'ArrowRight':
                            if (_grid.info.gSelectionPolicy === 'range' && e.shiftKey) {
                                utils.unselectCells(gId);
                                if (_grid.variables._targetCell.col <= startCell.col) {
                                    newTargetCell = utils.getMoveColCell(endCell, 1)!;
                                    utils.selectCells(startCell, newTargetCell);
                                }
                                else {
                                    newTargetCell = utils.getMoveColCell(startCell, 1)!;
                                    utils.selectCells(newTargetCell, endCell, newTargetCell)!;
                                }
                            }
                            else {
                                newTargetCell = utils.getMoveColCell(_grid.variables._targetCell, 1)!;
                                utils.selectCell(newTargetCell);
                            }
                            e.preventDefault();
                            break;
                        default:
                            break;
                    }
                }
            };
            document.removeEventListener('keydown', vg._docEvent_keydown);
            document.addEventListener('keydown', vg._docEvent_keydown);
            vg._docEvent_copy = function (e: any) {
                if (utils.activeGrid && !utils.activeGridEditor) {
                    const currentActiveCells = (utils as any)[(utils as any).activeGrid.gId].variables._activeCells;
                    if (currentActiveCells.length > 0) {
                        e.preventDefault();
                        utils.copyGrid(currentActiveCells);
                    }
                }
            };
            document.removeEventListener('copy', vg._docEvent_copy);
            document.addEventListener('copy', vg._docEvent_copy);

            vg._docEvent_paste = function (e: any) {
                if (utils.activeGrid && !utils.activeGridEditor) {
                    if ((utils as any)[(utils as any).activeGrid.gId].variables._activeCells.length > 0) {
                        e.preventDefault();
                        utils.pasteGrid(e, utils.activeGrid);
                    }
                }
            };
            document.removeEventListener('paste', vg._docEvent_paste);
            document.addEventListener('paste', vg._docEvent_paste);

            vg._VanillaGrid = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                }
            }
            if (!customElements.get('v-g')) customElements.define('v-g', vg._VanillaGrid);

            vg._GridHeader = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-h')) customElements.define('v-g-h', vg._GridHeader);

            vg._GridBody = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-b')) customElements.define('v-g-b', vg._GridBody);

            vg._GridFooter = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    if (!this.style.gridTemplateColumns.includes('%')) {
                        const _grid: any = window[(this as any).gId];
                        let totalWidth = 0;
                        if(!_grid._getFooterCells() || _grid._getFooterCells().length <= 0) return;
                        for(let col = 1; col < _grid.getColCount(); col++) {
                            totalWidth += utils.extractNumberAndUnit(_grid.getColOriginWidth(col)).number;
                        }
                        this.style.width = totalWidth + 'px';
                    }
                }
            }
            if (!customElements.get('v-g-f')) customElements.define('v-g-f', vg._GridFooter);

            vg._GridData = class extends HTMLElement {
                constructor() {
                    super();
                }
                connectedCallback() {
                    const _grid: any = window[(this as any).gId];
                    const _gridInfo: any = _grid.getGridInfo();
                    
                    this.style.removeProperty('display');
                    this.style.removeProperty('align-items');
                    this.style.removeProperty('justify-content');
                    this.style.removeProperty('text-align');
                    this.style.removeProperty('z-index');

                    function extractNumberAndUnit (val: string): any {
                        if (val === null || val === undefined) return '';
                        val = '' + val.trim();
                        const regex = /^(\d+)(\D*)$/;
                        const match = val.match(regex);
                        if (match) {
                            const unit = match[2] === '' ? 'px' : match[2];
                            return { number: parseInt(match[1], 10), unit: unit };
                        } else {
                            return '';
                        }
                    }

                    function isCellVisible (cell: Cell) {
                        if (!cell) return;
                        return !(cell.cColVisible === false || cell.cRowVisible === false || cell.cFilter === true);
                    }

                    function getOnlyNumberWithNaNToNull (value: any) {
                        const returnValue = Number(value);
                        if (isNaN(returnValue)) {
                            return null;
                        }
                        return returnValue;
                    }

                    function getOnlyNumberWithNaNToZero (value: any) {
                        const returnValue = Number(value);
                        if (isNaN(returnValue)) {
                            return 0;
                        }
                        return returnValue;
                    }

                    function getFirstCellValidNumber (grid: any, footerCell: Cell) {
                        let returnNumber;
                        let tempCell;
                        for(let r = 1; r < grid.getRowCount(); r++ ) {
                            tempCell = grid._getCell(r, footerCell.col);
                            if (!isCellVisible(tempCell)) continue;
                            returnNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                            if (returnNumber) return returnNumber;
                        }
                        return null;
                    }

                    switch ((this as any).gType) {
                        case 'ghd': 
                            this.innerText = (this as any).cValue;
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getHeaderCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getHeaderCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getHeaderCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getHeaderCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = 'sticky',
                                this.style.zIndex = String(300 + _grid.getColCount() - (this as any).col),
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenCol = true;
                            }
                            
                            if ((this as any).rowMerge) {
                                let r = (this as any).row - 1;
                                let spanNode = _grid._getHeaderCell(r, (this as any).col);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.rowMerge) {
                                        
                                        spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                        spanNode.rowSpan = spanNode.rowSpan ? spanNode.rowSpan + 1 : 1;
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                        break;
                                    }
                                    r--;
                                    spanNode = _grid._getHeaderCell(r, (this as any).col);
                                }
                                this.style.display = 'none';
                            }
                            
                            if ((this as any).colMerge) {
                                let c = (this as any).col - 1;
                                let spanNode = _grid._getHeaderCell((this as any).row, c);
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode.colMerge) {
                                        if (spanNode.cId === 'v-g-rownum' || spanNode.cId === 'v-g-status') break;
                                        spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                        spanNode.style.width = extractNumberAndUnit(spanNode.style.width).number + this.offsetWidth + 'px';
                                        spanNode.colSpan = spanNode.colSpan ? spanNode.colSpan + 1 : 1;
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '250';
                                        break;
                                    }
                                    c--;
                                    spanNode = _grid._getHeaderCell((this as any).row, c);
                                }
                                this.style.display = 'none';
                            }
                            
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            
                            if (_grid.getHeaderRowCount() === (this as any).row) {
                                let targetCell: any = this;
                                if ((this as any).rowMerge) {
                                    for(let r = (this as any).row - 1; r > 0; r--) {
                                        targetCell = _grid._getHeaderCell(r, (this as any).col);
                                        if (targetCell.rowSpan) break;
                                    }
                                }
                                if (targetCell) targetCell.isLastCell = true;
                            }
                            
                            if (_gridInfo.filterable === true && _grid.getColInfo((this as any).cId).filterable &&
                                _grid.getHeaderRowCount() === (this as any).row && (this as any).cId !== 'v-g-rownum' && (this as any).cId !== 'v-g-status') {
                                let filterSpan: any;
                                const vgFilterSpan = _grid._getFilterSpan();
                                if(vgFilterSpan && vgFilterSpan instanceof HTMLElement && vgFilterSpan.nodeType === 1) {
                                    filterSpan = vgFilterSpan.cloneNode(true);
                                }
                                else {
                                    filterSpan = document.createElement('span');
                                    filterSpan.innerText = 'σ';
                                }
                                filterSpan.gId = (this as any).gId;
                                filterSpan.isChild = true;
                                filterSpan.gType = 'filter';
                                filterSpan.classList.add((this as any).gId + '_filterSpan'); 

                                const filterSelect: any = document.createElement('select');
                                filterSelect.classList.add((this as any).gId + '_filterSelect'); 
                                filterSelect.style.display = 'none';
                                filterSelect.gId = (this as any).gId;
                                filterSelect.cId = (this as any).cId;

                                filterSelect.addEventListener('mousedown', function (e: any) {
                                    this.filterOldValue = e.target.value;
                                })

                                filterSelect.addEventListener('change', function (e: any) {
                                    const filterNewValue = e.target.value;
                                    if ((window as any)[e.target.parentNode.parentNode.gId + '_onChooseFilter'](e.target.parentNode.parentNode.row, e.target.parentNode.parentNode.cId, this.filterOldValue, filterNewValue) === false) {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        return;
                                    }
                                    _grid._doFilter();
                                    if (filterNewValue === '$$ALL') {
                                        this.style.display = 'none';
                                    }
                                });

                                filterSpan.append(filterSelect);

                                let targetCell: any = this;
                                if ((this as any).rowMerge) {
                                    for(let r = (this as any).row - 1; r > 0; r--) {
                                        targetCell = _grid._getHeaderCell(r, (this as any).col);
                                        if (targetCell.rowSpan) break;
                                    }
                                }
                                if (targetCell) targetCell.insertBefore(filterSpan, targetCell.firstChild);  
                            }

                            this.classList.add((this as any).gId + '_h-v-g-d');
                            break;
                        case 'gfd': 
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getFooterCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getFooterCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getFooterCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getFooterCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = '-webkit-sticky',
                                this.style.zIndex = '300',
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenCol = true;
                            }
                            
                            if ((this as any).cFooter) {
                                this.classList.add((this as any).gId + '_f-v-g-d-value');
                                let preSibling;
                                try {
                                    preSibling = _grid._getFooterCell((this as any).row, (this as any).col - 1);
                                } catch (error) {
                                    preSibling = null;
                                }
                                if (preSibling) {
                                    preSibling.classList.add((this as any).gId + '_f-v-g-d-value');
                                }
                                if (Object.values(footerUnit).includes((this as any).cFooter)) {
                                    let footerNumber;
                                    let tempNumber;
                                    let tempCell;
                                    switch ((this as any).cFooter) {
                                        case '$$MAX':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                tempNumber = getFirstCellValidNumber(_grid, (this as any));
                                                footerNumber = tempNumber;
                                                for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    tempNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                                                    if (tempNumber !== null && tempNumber > footerNumber!) {
                                                        footerNumber = tempNumber;
                                                    }
                                                }
                                            }
                                            break;
                                        case '$$MIN':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                tempNumber = getFirstCellValidNumber(_grid, (this as any));
                                                footerNumber = tempNumber;
                                                for(let r = 2; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    tempNumber = getOnlyNumberWithNaNToNull(tempCell.cValue);
                                                    if (tempNumber !== null && tempNumber < footerNumber!) {
                                                        footerNumber = tempNumber;
                                                    }
                                                }
                                            }
                                            break;
                                        case '$$SUM':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                footerNumber = 0;
                                                for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell.cValue)) * 100000) / 100000;
                                                }
                                            }
                                            break;
                                        case '$$AVG':
                                            this.style.justifyContent = 'right';
                                            this.style.textAlign = 'right';
                                            if (_grid.getRowCount() > 0) {
                                                footerNumber = 0;
                                                tempNumber = 0;
                                                let count = 0;
                                                for(let r = 1; r <= _grid.getRowCount(); r++ ) {
                                                    tempCell = _grid._getCell(r, (this as any).col);
                                                    if (!isCellVisible(tempCell)) continue;
                                                    footerNumber = Math.round((footerNumber + getOnlyNumberWithNaNToZero(tempCell.cValue)) * 100000) / 100000;
                                                    if (tempCell.cValue !== null && tempCell.cValue !== undefined && !isNaN(tempCell.cValue)) {
                                                        count++;
                                                    }
                                                }
                                                if (count === 0) {
                                                    footerNumber = null
                                                }
                                                else  {
                                                    footerNumber = (footerNumber/count).toFixed(2);
                                                }
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    if (footerNumber === null || footerNumber === undefined) {
                                        footerNumber = '-'
                                    }
                                    else {
                                        footerNumber = utils.getFormatNumber(_grid.getColFormat((this as any).col), footerNumber)
                                    }
                                    (this as any).innerText = footerNumber;
                                    (this as any).cValue = footerNumber;
                                }
                                else if (typeof (this as any).cFooter === 'function') {
                                    const functionResult = (this as any).cFooter(_grid.getValues());
                                    this.innerText = functionResult;
                                    (this as any).cValue = functionResult;
                                }
                                else {
                                    this.innerText = (this as any).cFooter;
                                    (this as any).cValue = (this as any).cFooter;

                                    const vgFooterFormula = _grid._getFooterFormula();
                                    if(vgFooterFormula.constructor === Object) {
                                        Object.keys(vgFooterFormula).forEach(key => {
                                            if((this as any).cFooter === key) {
                                                const result = vgFooterFormula[key](_grid.getColValues((this as any).cIndex));
                                                this.innerText = result;
                                                (this as any).cValue = result;
                                            }
                                        });
                                    }
                                }
                            }
                            if ((this as any).cAlign) {
                                this.style.justifyContent = (this as any).cAlign;
                                this.style.textAlign = (this as any).cAlign;
                            }
                            if ((this as any).col === _grid.getColCount()) {
                                this.classList.add((this as any).gId + '_f-v-g-d-value');
                            }
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            this.classList.add((this as any).gId + '_f-v-g-d');
                            break;
                        case 'gbd': 
                            
                            switch ((this as any).cDataType) {
                                case 'text':
                                case 'mask':
                                    this.style.justifyContent = 'left';
                                    this.style.textAlign = 'left';
                                    break;
                                case 'number':
                                    this.style.justifyContent = 'right';
                                    this.style.textAlign = 'right';
                                    break;
                                case 'date':
                                case 'month':
                                case 'code':
                                case 'select':
                                case 'checkbox':
                                case 'button':
                                case 'link':
                                    this.style.justifyContent = 'center';
                                    this.style.textAlign = 'center';
                                    break;
                                default:
                                    this.style.justifyContent = 'center';
                                    this.style.textAlign = 'center';

                                    const dataTypeStyle = _grid._getDataTypeStyle();
                                    Object.keys(dataTypeStyle).forEach((key) => {
                                        if((this as any).cDataType === key) {
                                            if(dataTypeStyle[key].constructor !== Object) throw new Error('Cellstyle can only be inserted in object type.');
                                            Object.keys(dataTypeStyle[key]).forEach((styleKey) => {
                                                (this as any).style[styleKey] = dataTypeStyle[key][styleKey];
                                            });
                                        }
                                    });
                                    break;
                            }
                            while (this.firstChild) {
                                this.removeChild(this.firstChild);
                            }
                            this.append(_grid._getCellChildNode(this));
                            
                            if ((this as any).row <= _gridInfo.frozenRowCount) {
                                let headerOffsetHeight = _grid._getHeader().offsetHeight;
                                let topElement;
                                let topElementOffsetHeight = 0;
                                for(let r = (this as any).row - 1; r > 0; r--) {
                                    topElement = _grid._getCell(r, (this as any).col);
                                    if (!topElement) {
                                        topElementOffsetHeight = topElementOffsetHeight + 0;
                                    }
                                    else if (topElement.colMerge) {
                                        let c = (this as any).col - 1;
                                        let spanNode = _grid._getCell(r, c);
                                        while(spanNode) {
                                            if (c < 0) break;
                                            if (!spanNode.colMerge) {
                                                break;
                                            }
                                            c--;
                                            spanNode = _grid._getCell(r, c);
                                        }
                                        topElementOffsetHeight = topElementOffsetHeight + spanNode.offsetHeight;
                                    }
                                    else {
                                        topElementOffsetHeight = topElementOffsetHeight + _grid._getCell(r, (this as any).col).offsetHeight;
                                    }
                                }
                                this.style.position = 'sticky';
                                this.style.zIndex = '200';
                                this.style.top = headerOffsetHeight + topElementOffsetHeight + 'px';
                                if ((this as any).row === _gridInfo.frozenRowCount) this.style.borderBottom = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                                (this as any).frozenCol = true;
                            }
                            
                            if (_gridInfo.frozenRowCount <= 0 && (this as any).col <= _gridInfo.frozenColCount) {
                                let leftElement;
                                let leftElementOffsetWidth = 0

                                for(let c = (this as any).col - 1; c > 0; c--) {
                                    leftElement = _grid._getCell((this as any).row, c);
                                    if (!leftElement) {
                                        leftElementOffsetWidth = leftElementOffsetWidth + 0;
                                    }
                                    else if (leftElement.rowMerge) {
                                        let r = (this as any).row - 1;
                                        let spanNode = _grid._getCell(r, c);
                                        while(spanNode) {
                                            if (r < 0) break;
                                            if (!spanNode.rowMerge) {
                                                break;
                                            }
                                            r--;
                                            spanNode = _grid._getCell(r, c);
                                        }
                                        leftElementOffsetWidth = leftElementOffsetWidth + spanNode.offsetWidth;
                                    }
                                    else {
                                        leftElementOffsetWidth = leftElementOffsetWidth + _grid._getCell((this as any).row, c).offsetWidth;
                                    }
                                }
                                this.style.position = 'sticky';
                                this.style.zIndex = '200';
                                if ((this as any).col === _gridInfo.frozenColCount) this.style.borderRight = _gridInfo.cssInfo.verticalBorderSize + 'px solid ' + _gridInfo.cssInfo.headerCellBorderColor;
                                this.style.left = leftElementOffsetWidth + 'px';
                                (this as any).frozenRow = true;
                            }
                            
                            if ((this as any).rowMerge) {
                                let r = (this as any).row - 1;
                                let spanNode = _grid._getCell(r, (this as any).col);
                                while(spanNode) {
                                    if (r < 0) break;
                                    if (!spanNode.rowMerge) {
                                        spanNode.style.gridRowEnd = this.style.gridRowEnd;
                                        if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                        break;
                                    }
                                    r--;
                                    spanNode = _grid._getCell(r, (this as any).col);
                                }
                                
                                if (isCellVisible(spanNode)) {
                                    this.style.display = 'none';
                                }
                            }
                            
                            if ((this as any).colMerge) {
                                let c = (this as any).col - 1;
                                let spanNode = _grid._getCell((this as any).row, c);
                                while(spanNode) {
                                    if (c < 0) break;
                                    if (!spanNode.colMerge) {
                                        spanNode.style.gridColumnEnd = this.style.gridColumnEnd;
                                        
                                        if (!spanNode.cAlign) spanNode.style.justifyContent = 'center';
                                        if (!spanNode.cAlign) spanNode.style.textAlign = 'center';
                                        if (!spanNode.cVerticalAlign) spanNode.style.alignItems = 'center';
                                        spanNode.style.zIndex = spanNode.style.zIndex ? spanNode.style.zIndex : '50';
                                        break;
                                    }
                                    c--;
                                    spanNode = _grid._getCell((this as any).row, c);
                                }
                                this.style.display = 'none';
                            }
                            
                            if ((this as any).cAlign) {
                                this.style.justifyContent = (this as any).cAlign;
                                this.style.textAlign = (this as any).cAlign;
                            }

                            if ((this as any).cVerticalAlign) {
                                switch ((this as any).cVerticalAlign.toLowerCase()) {
                                    case 'top':
                                        this.style.alignItems = 'flex-start';
                                        break;
                                    case 'bottom':
                                        this.style.alignItems = 'flex-end';
                                        break;
                                    default:
                                        this.style.alignItems = 'center';
                                        break;
                                }
                            }
                            if ((this as any).cOverflowWrap) this.style.overflowWrap = (this as any).cOverflowWrap;
                            if ((this as any).cWordBreak) this.style.wordBreak = (this as any).cWordBreak;
                            if ((this as any).cWhiteSpace) this.style.whiteSpace = (this as any).cWhiteSpace;
                            if ((this as any).cBackColor) this.style.backgroundColor = (this as any).cBackColor;
                            if ((this as any).cFontColor) (this as any).firstChild.style.color = (this as any).cFontColor;
                            if ((this as any).cFontBold) (this as any).firstChild.style.fontWeight = 'bold';
                            if ((this as any).cFontItalic) (this as any).firstChild.style.fontStyle = 'italic';
                            if ((this as any).cFontThruline) (this as any).firstChild.style.textDecoration = 'line-through';
                            if ((this as any).cFontUnderline) (this as any).firstChild.style.textDecoration = 'underline';
                            if (!(this as any).cColVisible || !(this as any).cRowVisible) {
                                this.style.display = 'none';
                            }
                            if ((this as any).cFilter) {
                                this.style.display = 'none';
                            }
                            
                            if (_gridInfo.alterRow && (this as any).row % 2 === 0) {
                                this.classList.add((this as any).gId + '_b-v-g-d-alter');
                                this.classList.remove((this as any).gId + '_b-v-g-d');
                            }
                            else {
                                this.classList.add((this as any).gId + '_b-v-g-d');
                                this.classList.remove((this as any).gId + '_b-v-g-d-alter');
                            }
                            if ((this as any).cLocked && (this as any).cLockedColor) {
                                this.classList.add((this as any).gId + '_b-v-g-d-locked');
                            }
                            else {
                                this.classList.remove((this as any).gId + '_b-v-g-d-locked');
                            }
                            if((this as any).cLocked) {
                                if ((this as any).cDataType === 'select' && this.firstChild && (this as any).firstChild.nType == 'select') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                                else if ((this as any).cDataType === 'checkbox' && this.firstChild && (this as any).firstChild.nType == 'checkbox') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                            }
                            if ((this as any).cUntarget) {
                                if ((this as any).cDataType === 'button' && this.firstChild && (this as any).firstChild.nType == 'button') {
                                    (this as any).firstChild.disabled = true;
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                                else if ((this as any).cDataType === 'link' && this.firstChild && (this as any).firstChild.nType == 'link') {
                                    (this as any).firstChild.style.opacity = '0.8';
                                    (this as any).firstChild.style.pointerEvents = 'none';
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    this.classList.add((this as any).gId + '_v-g-d');

                    this.addEventListener('mouseover', function (e) {
                        if (!(this as any).cUntarget && (this as any).gType === 'gbd') {
                            this.classList.add((this as any).gId + '_mouseover-cell');
                            if ((this as any).cDataType === 'link') {
                                const childList = this.querySelectorAll('*');
                                childList.forEach(child => {
                                    child.classList.add((this as any).gId + '_mouseover-cell');
                                });
                            }
                        }
                    });

                    this.addEventListener('mouseout', function (e) {
                        if (!(this as any).cUntarget && (this as any).gType === 'gbd') {
                            this.classList.remove((this as any).gId + '_mouseover-cell');
                            if ((this as any).cDataType === 'link') {
                                const childList = this.querySelectorAll('*');
                                childList.forEach(child => {
                                    child.classList.remove((this as any).gId + '_mouseover-cell');
                                });
                            }
                        }
                    });
                }
            }
            if (!customElements.get('v-g-d')) customElements.define('v-g-d', vg._GridData); 
        }
        this.destroy = function () {
            this.gridIds.forEach((gId: string) => {
                const vanillagrid = document.getElementById(gId);
                const stylesSheet = document.getElementById(gId + '_styles-sheet');
                if (vanillagrid) (vanillagrid as any).parentNode.removeChild(vanillagrid);
                if (stylesSheet) (stylesSheet as any).parentNode.removeChild(stylesSheet);
                delete (window as any)[gId];
            });
            document.removeEventListener('mousedown', this._docEvent_mousedown);
            document.removeEventListener('mouseup', this._docEvent_mouseup);
            document.removeEventListener('keydown', this._docEvent_keydown);
            document.removeEventListener('copy', this._docEvent_copy);
            document.removeEventListener('paste', this._docEvent_paste);
            GRIDS = {};
            this.gridIds = [];
        }
    }
    return new (VanillagridInstance as unknown as VanillagridConstructor)();
}
export default getVanillagrid();
