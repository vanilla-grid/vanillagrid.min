//ENUM
export const enum Align {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}
export const enum VerticalAlign {
    TOP = "top",
    CENTER = "center",
    BOTTOM = "bottom"
}
export const enum SelectionPolicy {
    SINGLE = "single",
    RANGE = "range",
    NONE = "none"
}
export const enum ColorSet {
    SKYBLUE = "skyblue",
    BLUE = "blue",
    LIGHT_RED = "light-red",
    RED = "red",
    LIGHT_GREEN = "light-green",
    GREEN = "green",
    ORANGE = "orange",
    YELLOW = "yellow",
    PURPLE = "purple",
    BROWN = "brown",
    BLACK = "black"
}
//INTERFACE
interface DefaultGridInfo {
    locked: boolean;
    lockedColor: boolean;
    resizable: boolean;
    redoable: boolean;
    redoCount: number;
    visible: boolean;
    headerVisible: boolean;
    rownumVisible: boolean;
    rownumSize: string;
    statusVisible: boolean;
    selectionPolicy: SelectionPolicy.SINGLE | SelectionPolicy.RANGE | SelectionPolicy.NONE | string | null;
    nullValue: any;
    dateFormat: string;
    monthFormat: string;
    alterRow: boolean;
    frozenColCount: 0;
    frozenRowCount: 0;
    sortable: boolean;
    filterable: boolean;
    allCheckable: boolean;
    checkedValue: string;
    uncheckedValue: string;
}
interface DefaultGridCssInfo extends Omit<GridCssInfo, 'cellFontSize' |'cellMinHeight'>{
    cellFontSize : number,
    cellMinHeight : number,
}
interface DefaultColInfo {
    rowMerge: boolean;
    colMerge: boolean;
    colVisible: boolean;
    required: boolean;
    resizable: boolean;
    sortable: boolean;
    filterable: boolean;
    originWidth: '80px';
    dataType: 'text';
    selectSize: '100%';
    format: string | null;
    codes: string[] | null;
    defaultCode: string | null;
    maxLength: number | null;
    maxByte: number | null;
    maxNumber: number | null;
    minNumber: number | null;
    roundNumber: number | null;
    align: string | null;
    verticalAlign: string | null;
    overflowWrap: string | null;
    wordBreak: string | null;
    whiteSpace: string | null;
    backColor: string | null;
    fontColor: string | null;
    fontBold: boolean;
    fontItalic: boolean;
    fontThruline: boolean;
    fontUnderline: boolean;
}
export interface GridInfo {
    id: string;
    index: number;
    type: string;
    name: string | null;
    locked: boolean | null;
    lockedColor: boolean | null;
    resizable: boolean | null;
    redoable: boolean | null;
    redoCount: number | null;
    visible: boolean | null;
    headerVisible: boolean | null;
    rownumVisible: boolean | null;
    rownumSize: string | null;
    rownumLockedColor: boolean | null;
    statusVisible: boolean | null;
    statusLockedColor: boolean | null;
    selectionPolicy: SelectionPolicy.SINGLE | SelectionPolicy.RANGE | SelectionPolicy.NONE | string | null;
    nullValue: any | null;
    dateFormat: string | null;
    monthFormat: string | null;
    alterRow: boolean | null;
    frozenColCount: number | null;
    frozenRowCount: number | null;
    sortable: boolean | null;
    filterable: boolean | null;
    allCheckable: boolean | null;
    checkedValue: string | null;
    uncheckedValue: string | null;
}
export interface GridCssInfo {
    width: string | null;
    height: string | null;
    margin: string | null;
    padding: string | null;
    sizeLevel: number | null;
    verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM | string | null;
    cellFontSize: string | null;
    cellMinHeight: string | null;
    horizenBorderSize: number | null;
    verticalBorderSize: number | null;
    gridFontFamily: string | null;
    editorFontFamily: string | null;
    overflowWrap: string | null;
    wordBreak: string | null;
    whiteSpace: string | null;
    linkHasUnderLine: boolean | null;
    invertColor: boolean | null;
    color: string | null;
    colorSet: ColorSet.BLACK
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
        | string | null;
    gridBorderColor: string | null;
    headerCellBackColor: string | null;
    headerCellBorderColor: string | null;
    headerCellFontColor: string | null;
    footerCellBackColor: string | null;
    footerCellBorderColor: string | null;
    footerCellFontColor: string | null;
    bodyBackColor: string | null;
    bodyCellBackColor: string | null;
    bodyCellBorderColor: string | null;
    bodyCellFontColor: string | null;
    editorBackColor: string | null;
    editorFontColor: string | null;
    selectCellBackColor: string | null;
    selectCellFontColor: string | null;
    selectColBackColor: string | null;
    selectColFontColor: string | null;
    selectRowBackColor: string | null;
    selectRowFontColor: string | null;
    mouseoverCellBackColor: string | null;
    mouseoverCellFontColor: string | null;
    lockCellBackColor: string | null;
    lockCellFontColor: string | null;
    alterRowBackColor: string | null;
    alterRowFontColor: string | null;
    buttonFontColor: string | null;
    buttonBorderColor: string | null;
    buttonBackColor: string | null;
    buttonHoverFontColor: string | null;
    buttonHoverBackColor: string | null;
    buttonActiveFontColor: string | null;
    buttonActiveBackColor: string | null;
    linkFontColor: string | null;
    linkHoverFontColor: string | null;
    linkActiveFontColor: string | null;
    linkVisitedFontColor: string | null;
    linkFocusFontColor: string | null;
}
export interface CellColInfo {
    cId: string;
    cIndex: number | null;
    cName: string | null;
    cHeader: string[] | null;
    cUntarget: boolean | null;
    cRowMerge: boolean | null;
    cColMerge: boolean | null;
    cColVisible: boolean | null;
    cRowVisible: boolean | null;
    cRequired: boolean | null;
    cResizable: boolean | null;
    cSortable: boolean | null;
    cFilterable: boolean | null;
    cOriginWidth: string | null;
    cDataType: string | null;
    cSelectSize: string | null;
    cLocked: boolean | null;
    cLockedColor: boolean | null;
    cFormat: string | null;
    cCodes: string[] | null;
    cDefaultCode: string | null;
    cMaxLength: number | null;
    cMaxByte: number | null;
    cMaxNumber: number | null;
    cMinNumber: number | null;
    cRoundNumber: number | null;
    cFilterValues: Set<string> | null;
    cFilterValue: string | null;
    cFilter: boolean | null;
    cAlign: Align.LEFT | Align.CENTER | Align.RIGHT | string | null;
    cVerticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM | string | null;
    cOverflowWrap: string | null;
    cWordBreak: string | null;
    cWhiteSpace: string | null;
    cBackColor: string | null;
    cFontColor: string | null;
    cFontBold: boolean | null;
    cFontItalic: boolean | null;
    cFontThruline: boolean | null;
    cFontUnderline: boolean | null;
    cFooter: string[] | string | null;
}
export interface ColInfo {
    id: string;
    index?: number | null;
    name?: string | null;
    header?: string | null;
    footer?: string | null;
    untarget?: boolean | null;
    rowMerge?: boolean | null;
    colMerge?: boolean | null;
    colVisible?: boolean | null;
    rowVisible?: boolean | null;
    required?: boolean | null;
    resizable?: boolean | null;
    sortable?: boolean | null;
    filterable?: boolean | null;
    originWidth?: string | null;
    dataType?: string | null;
    selectSize?: string | null;
    locked?: boolean | null;
    lockedColor?: boolean | null;
    format?: string | null;
    codes?: string[] | null;
    defaultCode?: string | null;
    maxLength?: number | null;
    maxByte?: number | null;
    maxNumber?: number | null;
    minNumber?: number | null;
    roundNumber?: number | null;
    filterValues?: Set<string> | null;
    filterValue?: string | null;
    filter?: boolean | null;
    align?: Align.LEFT | Align.CENTER | Align.RIGHT | string | null;
    verticalAlign?: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM | string | null;
    overflowWrap?: string | null;
    wordBreak?: string | null;
    whiteSpace?: string | null;
    backColor?: string | null;
    fontColor?: string | null;
    fontBold?: boolean | null;
    fontItalic?: boolean | null;
    fontThruline?: boolean | null;
    fontUnderline?: boolean | null;
}
export interface Cell extends HTMLElement, CellColInfo {
    gId: string;
    gType: string;
    cValue: any;
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
    rowMerge: boolean;
    colMerge: boolean;
}
export interface GridHeader extends HTMLElement{
    gId?: string;
    gType? : string;
}
export interface GridBody extends HTMLElement {
    gId?: string;
    gType? : string;
}
export interface GridFooter extends HTMLElement {
    gId?: string;
    gType? : string;
}
export interface CellData {
    gridId: string;
    gridName: string;
    id: string;
    index: number;
    name: string;
    row: number;
    col: number;
    text: string;

    untarget?: boolean;
    colVisible?: boolean;
    rowVisible?: boolean;
    required?: boolean;
    resizable?: boolean;
    originWidth?: string;
    dataType?: string;
    selectSize?: string | null;
    locked?: boolean;
    lockedColor?: boolean;
    format?: string | null;
    codes?: string[] | null;
    defaultCode?: string | null;
    maxLength?: number | null;
    maxByte?: number | null;
    maxNumber?: number | null;
    minNumber?: number | null;
    roundNumber?: number | null;
    align?: Align.LEFT | Align.CENTER | Align.RIGHT;
    verticalAlign?: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM | null;
    overflowWrap?: string | null;
    wordBreak?: string | null;
    whiteSpace?: string | null;
    backColor?: string | null;
    fontColor?: string | null;
    fontBold?: boolean;
    fontItalic?: boolean;
    fontThruline?: boolean;
    fontUnderline?: boolean;

    value?: any;
    filter?: any;
}
export interface DataTypePack {
    cellStyle?: Partial<CSSStyleDeclaration>;
    onSelected?: (target: HTMLElement, data: CellData) => void;
    onUnselected?: (target: HTMLElement, data: CellData) => void;
    onSelectedAndKeyDown?: (event: KeyboardEvent, data: CellData) => void;
    onClick?: (event: MouseEvent, data: CellData) => void;
    onMousedown?: (event: MouseEvent, data: CellData) => void;
    getValue?: (value: any) => any;
    getText?: (value: any) => string | null;
    getChildNode?: (data: CellData) => HTMLElement | null;
    getEditor?: (
        target: HTMLElement,
        data: CellData,
        call_modify: () => void,
        call_endEdit: () => void
    ) => HTMLElement | null;
    getEditedValue?: (target: HTMLElement, data: CellData) => any;
    getFilterValue?: (value: any) => string | null;
    getSortValue?: (value: any) => any;
    getCopyValue?: (value: any) => any;
    getPasteValue?: (data: CellData, text: string) => any;
}
interface DataType {
    [key: string]: DataTypePack;
}
export interface CellRecord {
    cell: Cell,
    oldValue: any,
    newValue: any,
}
export interface Vanillagrid {
    gridIds: string[];
    sortAscSpan: HTMLSpanElement | null;
    sortDescSpan: HTMLSpanElement | null;
    filterSpan: HTMLSpanElement | null;
    footerFormula: Record<string, string>;
    dataType: DataType;
    lessoreq0x7ffByte: number;
    lessoreq0xffffByte: number;
    greater0xffffByte: number;
    defaultGridInfo: DefaultGridInfo;
    defaultGridCssInfo: DefaultGridCssInfo;
    defaultColInfo: DefaultColInfo;

    get(gridId: string): GridMethods;
    checkRequiredFunction(cellData: any): void;
    _docEvent_mousedown: ((e: MouseEvent) => unknown) | null;
    _docEvent_mouseup: ((e: MouseEvent) => unknown) | null;
    _docEvent_keydown: ((e: KeyboardEvent) => unknown) | null;
    _docEvent_copy: ((e: ClipboardEvent) => unknown) | null;
    _docEvent_paste: ((e: ClipboardEvent) => unknown) | null;

    _VanillaGrid: HTMLElement | null;
    _GridHeader: HTMLElement | null;
    _GridBody: HTMLElement | null;
    _GridFooter: HTMLElement | null;
    _GridData: null;

    create(): void;
    destroy(): void;
}
export interface VanillagridConstructor {
    new (): Vanillagrid;
}
/**
 * Provides various methods to manipulate and manage a Vanillagrid instance.
 * 
 * - This interface includes over 200 methods for handling grid structure, data,
 *   filtering, sorting, appearance, and user interactions.
 * - A `GridMethods` instance can be retrieved using `vg.get(gridId)`.
 * - It allows users to dynamically modify grid properties, update cell values,
 *   and customize the grid's behavior through predefined methods.
 * 
 * ### Key Features:
 * - Manage grid headers, footers, rows, and columns.
 * - Load and retrieve data as JSON.
 * - Apply filters, sorting, and styling dynamically.
 * - Control grid visibility, locking, and resizing.
 * - Undo and redo changes within the grid.
 * 
 * ### Example usage:
 * ```typescript
 * const grid = vg.get('gridId');
 * grid.setHeaderText('col1', 'New Header');
 * grid.setCellValue(1, 'col1', 'Updated Value');
 * ```
 */
export interface GridMethods {
    /**
     * Returns the number of header rows in the grid.
     * 
     * - Calculates the maximum header depth across all columns.
     * - Useful for determining the hierarchical structure of headers.
     * 
     * ### Example usage:
     * ```typescript
     * const rowCount = grid.getHeaderRowCount();
     * console.log(rowCount); // e.g., 2
     * ```
     * 
     * @returns The number of header rows.
     */
    getHeaderRowCount(): number;
    /**
     * Returns the header text of the specified column.
     * 
     * - Retrieves the header information for the given column index or column ID.
     * - If multiple header rows exist, the texts are concatenated using `';'`.
     * 
     * ### Example usage:
     * ```typescript
     * const headerText = grid.getHeaderText('col1');
     * console.log(headerText); // e.g., "Main Header;Sub Header"
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns The concatenated header text.
     */
    getHeaderText(colIndexOrColId: number | string): string;
    /**
     * Sets the header text of the specified column.
     * 
     * - The `value` should be a `';'`-separated string representing multi-line headers.
     * - If the given value has fewer lines than the current header rows, empty strings are added.
     * - If the given value has more lines than the current header rows, additional rows are created.
     * - Reloads the header and filter values after updating.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setHeaderText('col1', 'Header1;Header2;Header3');
     * // The column 'col1' will have:
     * // - Row 1: "Header1"
     * // - Row 2: "Header2"
     * // - Row 3: "Header3"
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @param value The new header text, separated by `';'` for multiple rows.
     * @returns `true` if the update is successful.
     */
    setHeaderText(colIndexOrColId: number | string, value: string): boolean;
    /**
     * Reloads all column filters in the grid.
     * 
     * - Refreshes the filter values for all columns.
     * - Typically used after modifying values programmatically to ensure filters reflect the latest data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadFilterValue();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    reloadFilterValue(): boolean;
    /**
     * Reloads the filter for a specific column.
     * 
     * - Updates the filter values for the specified column index or column ID.
     * - Typically used after modifying values programmatically to ensure the filter is updated.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadColFilter('col1');
     * ```
     * 
     * @param colIndexOrColId The column index or column ID.
     * @returns `true` if the operation is successful.
     */
    reloadColFilter(colIndexOrColId: number | string): boolean;
    /**
     * Returns the number of footer rows in the grid.
     * 
     * - Calculates the maximum footer depth across all columns.
     * - Useful for determining the hierarchical structure of footers.
     * 
     * ### Example usage:
     * ```typescript
     * const footerRowCount = grid.getFooterRowCount();
     * console.log(footerRowCount); // e.g., 2
     * ```
     * 
     * @returns The number of footer rows.
     */
    getFooterRowCount(): number;
    /**
     * Reloads all footer values in the grid.
     * 
     * - Updates the footer values for all columns.
     * - Typically used after modifying values programmatically to ensure footers reflect the latest data.
     * 
     * ### Example usage:
     * ```typescript
     * grid.reloadFooterValue();
     * ```
     * 
     * @returns `true` if the operation is successful.
     */
    reloadFooterValue(): boolean;
    /**
     * Sets the display value of a specific footer cell.
     * 
     * - Updates the visible value of the footer at the given row and column.
     * - This change may be overridden when the footer is reloaded.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterValue(1, 'col1', 'Total: 100');
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @param value The new footer display value.
     * @returns `true` if the update is successful.
     */
    setFooterValue(row: number, colIndexOrColId: number | string, value: string): boolean;
    /**
     * Returns the value of a specific footer cell.
     * 
     * - Retrieves the stored value of the footer at the given row and column.
     * 
     * ### Example usage:
     * ```typescript
     * const footerValue = grid.getFooterValue(1, 'col1');
     * console.log(footerValue); // e.g., "Total: 100"
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @returns The footer value as a string.
     */
    getFooterValue(row: number, colIndexOrColId: number | string): string;
    /**
     * Sets the formula values for a specific column footer using a `';'`-separated string.
     * 
     * - The `formula` string should contain multiple formulas separated by `';'`.
     * - Reloads the footer after applying the formula.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterFormula('col1', '$$MAX;$$MIN;$$SUM;$$AVG');
     * ```
     * 
     * @param colId The column index or column ID.
     * @param formula The `';'`-separated string of formulas to apply.
     * @returns `true` if the update is successful.
     */
    setFooterFormula(colIndexOrColId: number | string, formula: string): boolean;
    /**
     * Returns the formula values defined for a specific column footer as a `';'`-separated string.
     * 
     * - If a formula is a function, it is replaced with `$$FUNC` in the returned string.
     * - Returns `null` if no formulas are defined.
     * 
     * ### Example usage:
     * ```typescript
     * const footerFormula = grid.getFooterFormula('col1');
     * console.log(footerFormula); // e.g., "SUM(A1:A10);AVG(A1:A10)"
     * ```
     * 
     * @param colId The column index or column ID.
     * @returns A `';'`-separated string of footer formulas, or `null` if none exist.
     */
    getFooterFormula(colIndexOrColId: number | string): string | null;
    /**
     * Defines a function for a specific footer cell.
     * 
     * - Sets a custom function for the footer at the given row and column.
     * - The function receives the grid's `getValues()` result as a parameter.
     * - Reloads the footer after setting the function.
     * 
     * ### Example usage:
     * ```typescript
     * grid.setFooterFunction(1, 'col1', function(values) {
     *     return values.length ? values.reduce((sum, v) => sum + v, 0) : 0;
     * });
     * ```
     * 
     * @param row The footer row index.
     * @param colId The column index or column ID.
     * @param func The function to apply to the footer cell.
     * @returns `true` if the update is successful.
     */
    setFooterFunction(row: number, colIndexOrColId: number | string, func: Function): boolean;
    /**
     * Returns the information of the current grid.
     * 
     * - Retrieves various properties related to the grid, excluding the internal `type` field.
     * - Returns a deep-copied object to prevent unintended modifications.
     * - Includes grid ID and CSS-related information.
     * 
     * ### Example usage:
     * ```typescript
     * const gridInfo = grid.getGridInfo();
     * console.log(gridInfo);
     * ```
     * 
     * @returns An object containing the grid's information.
     */
    getGridInfo(): GridInfo;
    /**
     * Loads data into the grid.
     * 
     * - Accepts data in two formats:
     *   - **Key-Value Format**: An array of objects where keys are column IDs.
     *   - **Datas Format**: A nested array where each cell contains an object with `id` and `value`.
     * - Clears existing grid data before loading new data.
     * 
     * ### Example usage:
     * ```typescript
     * // Key-Value format
     * grid.load([
     *     { col1: 'value1-1', col2: 'value1-2' },
     *     { col1: 'value2-1', col2: 'value2-2' }
     * ]);
     * 
     * // Datas format
     * grid.load([
     *     [{ id: 'col1', value: 'value1-1' }, { id: 'col2', value: 'value1-2' }],
     *     [{ id: 'col1', value: 'value2-1' }, { id: 'col2', value: 'value2-2' }]
     * ]);
     * ```
     * 
     * @param keyValueOrDatas The data to load, in key-value or datas format.
     * @returns `true` if the data is successfully loaded.
     */
    load(keyValueOrDatas: Record<string, any> | Record<string, any>[]): boolean;
    clear(): boolean;
    clearStatus(): boolean;
    getRowCount(): number;
    getColCount(): number;
    getValues(): Record<string, any>[];
    getDatas(): Record<string, any>[];
    sort(colId: string, isAsc?: boolean, isNumSort?: boolean): boolean;
    checkRequired(func: Function): boolean;
    setGridMount(isDrawable: boolean): boolean;
    getGridFilter(): Record<string, any>[];
    setGridWidth(cssTextWidth: string): boolean;
    setGridHeight(cssTextHeight: string): boolean;
    setGridSizeLevel(sizeLevel: number): void;
    setGridVerticalAlign(verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean;
    setCellFontSize(cssTextFontSize: string): boolean;
    setCellMinHeight(cssTextMinHeight: string): boolean;
    setHorizenBorderSize(pxHorizenBorderSize: number): boolean;
    setVerticalBorderSize(pxVerticalBorderSize: number): boolean;
    setGridColor(cssTextHexColor: string): boolean;
    setGridColorSet(colorSetName: ColorSet.BLACK
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
        | string | null): boolean;
    invertColor(doInvert: boolean): boolean;
    setGridName(gridName: string): boolean;
    getGridName(): string;
    setGridLocked(isLocked: boolean): boolean;
    isGridLocked(): boolean;
    setGridLockedColor(isLockedColor: boolean): boolean;
    setGridResizable(isResizable: boolean): boolean;
    isGridResizable(): void;
    setGridRecodeCount(recodeCount: number): boolean;
    getGridRecodeCount(): number;
    setGridRedoable(isRedoable: boolean): boolean;
    isGridRedoable(): boolean;
    setGridVisible(isVisible: boolean): boolean;
    isGridVisible(): boolean;
    setHeaderVisible(isVisible: boolean): boolean;
    isHeaderVisible(): boolean;
    setGridRownumLockedColor(isRownumLockedColor: boolean): boolean;
    isGridRownumLockedColor(): boolean;
    setGridRownumSize(rownumSize: number): boolean;
    getGridRownumSize(): string;
    setGridStatusLockedColor(isStatusLockedColor: boolean): boolean;
    isGridStatusLockedColor(): boolean;
    setGridSelectionPolicy(selectionPolicy: SelectionPolicy.RANGE | SelectionPolicy.SINGLE | SelectionPolicy.NONE): boolean;
    getGridSelectionPolicy(): string;
    setGridNullValue(nullValue: any): boolean;
    getGridNullValue(): any;
    setGridDateFormat(dateFormat: string): boolean;
    getGridDateFormat(): string;
    setGridMonthFormat(monthFormat: string): boolean;
    getGridMonthFormat(): string;
    setGridAlterRow(isAlterRow: boolean): boolean;
    setGridFrozenColCount(frozenColCount: number): boolean;
    getGridFrozenColCount(): number;
    setGridFrozenRowCount(frozenRowCount: number): boolean;
    getGridFrozenRowCount(): number;
    setGridSortable(isSortable: boolean): boolean;
    isGridSortable(): boolean;
    setGridFilterable(isFilterable: boolean): boolean;
    isGridFilterable(): boolean;
    setGridAllCheckable(isAllCheckable: boolean): boolean;
    isGridAllCheckable(): boolean;
    setGridCheckedValue(checkeValue: string): boolean;
    getGridCheckedValue(): string;
    setGridUncheckedValue(unCheckedValue: string): boolean;
    getGridUncheckedValue(): string;
    addCol(colIndexOrColId: number | string, colInfo: ColInfo): boolean;
    removeCol(colIndexOrColId: number | string): any[];
    setColInfo(colInfo: ColInfo): boolean;
    getColInfo(colIndexOrColId: number | string): ColInfo;
    getColDatas(colIndexOrColId: number | string): CellData[];
    setColSameValue(colIndexOrColId: number | string, value: any, doRecode?: boolean) : boolean;
    getColValues(colIndexOrColId: number | string): any[];
    getColTexts(colIndexOrColId: number | string): string[];
    isColUnique(colIndexOrColId: number | string): boolean;
    openColFilter(colIndexOrColId: number | string): boolean;
    closeColFilter(colIndexOrColId: number | string): boolean;
    setColFilterValue(colIndexOrColId: number | string, filterValue: string): boolean;
    getColFilterValues(colIndexOrColId: number | string): string[];
    getColFilterValue(colIndexOrColId: number | string): string | null;
    getColId(colIndexOrColId: number | string): string;
    getColIndex(colIndexOrColId: number | string): number;
    setColName(colIndexOrColId: number | string, colName: string): boolean;
    getColName(colIndexOrColId: number | string): string;
    setColUntarget(colIndexOrColId: number | string, isUntarget: boolean): boolean;
    setColRowMerge(colIndexOrColId: number | string, isRowMerge: boolean): boolean;
    isColRowMerge(colIndexOrColId: number | string): boolean | null;
    setColColMerge(colIndexOrColId: number | string, isColMerge: boolean): boolean;
    isColColMerge(colIndexOrColId: number | string): boolean | null;
    setColVisible(colIndexOrColId: number | string, isVisible: boolean): boolean;
    isColVisible(colIndexOrColId: number | string): boolean;
    setColRequired(colIndexOrColId: number | string, isRequired: boolean): boolean;
    isColRequired(colIndexOrColId: number | string): boolean;
    setColResizable(colIndexOrColId: number | string, isResizable: boolean): boolean;
    isColResizable(colIndexOrColId: number | string): boolean;
    setColSortable(colIndexOrColId: number | string, isSortable: boolean): boolean;
    isColSortable(colIndexOrColId: number | string): boolean;
    setColFilterable(colIndexOrColId: number | string, isFilterable: boolean): boolean;
    isColFilterable(colIndexOrColId: number | string): boolean;
    setColOriginWidth(colIndexOrColId: number | string, originWidth: string): boolean;
    getColOriginWidth(colIndexOrColId: number | string): string;
    setColDataType(colIndexOrColId: number | string, dataType: string): boolean;
    getColDataType(colIndexOrColId: number | string): string;
    setColSelectSize(colIndexOrColId: number | string, cssTextSelectSize: string): boolean;
    getColSelectSize(colIndexOrColId: number | string): string | null;
    setColLocked(colIndexOrColId: number | string, isLocked: boolean): boolean;
    isColLocked(colIndexOrColId: number | string): boolean;
    setColLockedColor(colIndexOrColId: number | string, isLockedColor: boolean): boolean;
    isColLockedColor(colIndexOrColId: number | string): boolean;
    setColFormat(colIndexOrColId: number | string, format: string): boolean;
    getColFormat(colIndexOrColId: number | string): string | null;
    setColCodes(colIndexOrColId: number | string, codes: string[]): boolean;
    getColCodes(colIndexOrColId: number | string): string[] | null;
    setColDefaultCode(colIndexOrColId: number | string, defaultCode: string): boolean;
    getColDefaultCode(colIndexOrColId: number | string): string | null;
    setColMaxLength(colIndexOrColId: number | string, maxLength: number): boolean;
    getColMaxLength(colIndexOrColId: number | string): number | null;
    setColMaxByte(colIndexOrColId: number | string, maxByte: number): boolean;
    getColMaxByte(colIndexOrColId: number | string): number | null;
    setColMaxNumber(colIndexOrColId: number | string, maxNumber: number): boolean;
    getColMaxNumber(colIndexOrColId: number | string): number | null;
    setColMinNumber(colIndexOrColId: number | string, minNumber: number): boolean;
    getColMinNumber(colIndexOrColId: number | string): number | null;
    setColRoundNumber(colIndexOrColId: number | string, roundNumber: number): boolean;
    getColRoundNumber(colIndexOrColId: number | string): number | null;
    setColAlign(colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean;
    getColAlign(colIndexOrColId: number | string): string | null;
    setColVerticalAlign(colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean;
    getColVerticalAlign(colIndexOrColId: number | string): string | null;
    setColOverflowWrap(colIndexOrColId: number | string, overflowWrap: string): boolean;
    getColOverflowWrap(colIndexOrColId: number | string): string | null;
    setColWordBreak(colIndexOrColId: number | string, wordBreak: string): boolean;
    getColWordBreak(colIndexOrColId: number | string): string | null;
    setColWhiteSpace(colIndexOrColId: number | string, whiteSpace: string): boolean;
    getColWhiteSpace(colIndexOrColId: number | string): string | null;
    setColBackColor(colIndexOrColId: number | string, hexadecimalBackColor: string): boolean;
    getColBackColor(colIndexOrColId: number | string): string | null;
    setColFontColor(colIndexOrColId: number | string, hexadecimalFontColor: string): boolean;
    getColFontColor(colIndexOrColId: number | string): string | null;
    setColFontBold(colIndexOrColId: number | string, isFontBold: boolean): boolean;
    isColFontBold(colIndexOrColId: number | string): boolean;
    setColFontItalic(colIndexOrColId: number | string, isFontItalic: boolean): boolean;
    isColFontItalic(colIndexOrColId: number | string): boolean;
    setColFontThruline(colIndexOrColId: number | string, isFontThruline: boolean): boolean;
    isColFontThruline(colIndexOrColId: number | string): boolean;
    setColFontUnderline(colIndexOrColId: number | string, isFontUnderline: boolean): boolean;
    isColFontUnderline(colIndexOrColId: number | string): boolean;
    addRow(rowOrValuesOrDatas?: number | Record<string, any> | Record<string, any>[], valuesOrDatas?: Record<string, any> | Record<string, any>[]): boolean;
    removeRow(row: number): Record<string, any>;
    setRowStatus(row: number, status: string): boolean;
    getRowStatus(row: number): string;
    setRowDatas(row: number, cellDatas: Record<string, any>[]): boolean;
    getRowDatas(row: number): Record<string, any>[];
    setRowValues(row: number, values: Record<string, any>, doRecode?: boolean): boolean;
    getRowValues(row: number): Record<string, any>;
    getRowTexts(row: number): Record<string, string>;
    setRowVisible(row: number, isVisible: boolean): boolean;
    isRowVisible(row: number): boolean;
    setRowDataType(row: number, dataType: string): boolean;
    setRowLocked(row: number, isRowLocked: boolean): boolean;
    setRowLockedColor(row: number, isRowLockedColor: boolean): boolean;
    setRowAlign(row: number, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean;
    setRowVerticalAlign(row: number, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean;
    setRowBackColor(row: number, hexadecimalBackColor: string): boolean;
    setRowFontColor(row: number, hexadecimalFontColor: string): boolean;
    setRowFontBold(row: number, isRowFontBold: boolean): boolean;
    setRowFontItalic(row: number, isRowFontItalic: boolean): boolean;
    setRowFontThruline(row: number, isRowFontThruline: boolean): boolean;
    setRowFontUnderline(row: number, isRowFontUnderline: boolean): boolean;
    searchRowsWithMatched(matches: Record<string, any>): number[];
    searchRowDatasWithMatched(matches: Record<string, any>): Record<string, any>[][];
    searchRowValuesWithMatched(matches: Record<string, any>): Record<string, any>[];
    searchRowsWithFunction(func: Function): number[];
    searchRowDatasWithFunction(func: Function): Record<string, any>[][];
    searchRowValuesWithFunction(func: Function): Record<string, any>[];
    setCellData(row: number, colIndexOrColId: number | string, cellData: CellData): boolean;
    getCellData(row: number, colIndexOrColId: number | string): CellData;
    setCellValue(row: number, colIndexOrColId: number | string, value: any, doRecode?: boolean): boolean;
    getCellValue(row: number, colIndexOrColId: number | string): any;
    getCellText(row: number, colIndexOrColId: number | string): string;
    setCellRequired(row: number, colIndexOrColId: number | string, isRequired: boolean): boolean;
    getCellRequired(row: number, colIndexOrColId: number | string): boolean;
    setCellDataType(row: number, colIndexOrColId: number | string, dataType: string): boolean;
    getCellDataType(row: number, colIndexOrColId: number | string): string;
    setCellLocked(row: number, colIndexOrColId: number | string, isLocked: boolean): boolean;
    isCellLocked(row: number, colIndexOrColId: number | string): boolean;
    setCellLockedColor(row: number, colIndexOrColId: number | string, isLockedColor: boolean): boolean;
    isCellLockedColor(row: number, colIndexOrColId: number | string): boolean;
    setCellFormat(row: number, colIndexOrColId: number | string, format: string): boolean;
    getCellFormat(row: number, colIndexOrColId: number | string): string | null;
    setCellCodes(row: number, colIndexOrColId: number | string, codes: string[]): boolean;
    getCellCodes(row: number, colIndexOrColId: number | string): string[] | null;
    setCellDefaultCode(row: number, colIndexOrColId: number | string, defaultCode: string): boolean;
    getCellDefaultCode(row: number, colIndexOrColId: number | string): string | null;
    setCellMaxLength(row: number, colIndexOrColId: number | string, maxLength: number): boolean;
    getCellMaxLength(row: number, colIndexOrColId: number | string): number | null;
    setCellMaxByte(row: number, colIndexOrColId: number | string, maxByte: number): boolean;
    getCellMaxByte(row: number, colIndexOrColId: number | string): number | null;
    setCellMaxNumber(row: number, colIndexOrColId: number | string, maxNumber: number): boolean;
    getCellMaxNumber(row: number, colIndexOrColId: number | string): number | null;
    setCellMinNumber(row: number, colIndexOrColId: number | string, minNumber: number): boolean;
    getCellMinNumber(row: number, colIndexOrColId: number | string): number | null;
    setCellRoundNumber(row: number, colIndexOrColId: number | string, roundNumber: number): boolean;
    getCellRoundNumber(row: number, colIndexOrColId: number | string): number | null;
    setCellAlign(row: number, colIndexOrColId: number | string, align: Align.LEFT | Align.CENTER | Align.RIGHT): boolean;
    getCellAlign(row: number, colIndexOrColId: number | string): string;
    setCellVerticalAlign(row: number, colIndexOrColId: number | string, verticalAlign: VerticalAlign.TOP | VerticalAlign.CENTER | VerticalAlign.BOTTOM): boolean;
    getCellVerticalAlign(row: number, colIndexOrColId: number | string): string | null;
    setCellOverflowWrap(row: number, colIndexOrColId: number | string, overflowWrap: string): boolean;
    getCellOverflowWrap(row: number, colIndexOrColId: number | string): string | null;
    setCellWordBreak(row: number, colIndexOrColId: number | string, wordBreak: string): boolean;
    getCellWordBreak(row: number, colIndexOrColId: number | string): string | null;
    setCellWhiteSpace(row: number, colIndexOrColId: number | string, whiteSpace: string): boolean;
    getCellWhiteSpace(row: number, colIndexOrColId: number | string): string | null;
    setCellVisible(row: number, colIndexOrColId: number | string, isVisible: boolean): boolean;
    isCellVisible(row: number, colIndexOrColId: number | string): boolean;
    setCellBackColor(row: number, colIndexOrColId: number | string, hexadecimalBackColor: string): boolean;
    getCellBackColor(row: number, colIndexOrColId: number | string): string | null;
    setCellFontColor(row: number, colIndexOrColId: number | string, hexadecimalFontColor: string): boolean;
    getCellFontColor(row: number, colIndexOrColId: number | string): string | null;
    setCellFontBold(row: number, colIndexOrColId: number | string, isFontBold: boolean): boolean;
    isCellFontBold(row: number, colIndexOrColId: number | string): boolean;
    setCellFontItalic(row: number, colIndexOrColId: number | string, isFontItalic: boolean): boolean;
    isCellFontItalic(row: number, colIndexOrColId: number | string): boolean;
    setCellFontThruline(row: number, colIndexOrColId: number | string, isFontThruline: boolean): boolean;
    isCellFontThruline(row: number, colIndexOrColId: number | string): boolean;
    setCellFontUnderline(row: number, colIndexOrColId: number | string, isFontUnderline: boolean): boolean;
    isCellFontUnderline(row: number, colIndexOrColId: number | string): boolean;
    setTargetCell(row:number, colIndexOrColId: number | string): boolean;
    getTargetRow(): number | null;
    getTargetCol(): number | null;
    setActiveCells(startRow: number, startColIndexOrColId: number | string, endRow: number, endColIndexOrColId: number | string): boolean;
    getActiveRows(): number;
    getActiveCols(): string[];
    getActiveRange(): { startRow: number | null; startColId : string | null; endRow : number | null; endColId : string | null; };
    editCell(row: number, colIndexOrColId: number | string): boolean;
    redo(): boolean;
    undo(): boolean;
    // _getFooterRow(rowIndex: number): void;
    // _getFooterCell(rowIndex: number, colIndexOrColId: number | string): void;
    // _getFooterCells(): void;
    // _getRow(rowIndex: number): void;
    // _getCell(rowIndex: number, colIndexOrColId: number | string): void;
    // _getCells(): void;
    // _doFilter(): void;
    // _getDataTypeStyle(): void;
    // _getFilterSpan(): void;
    // _getFooterFormula(): void;
    /* removeGridMethod(): void */
}
