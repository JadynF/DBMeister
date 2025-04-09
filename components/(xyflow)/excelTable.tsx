
import { Handle, Position } from '@xyflow/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

type ExcelField = {
    fieldName: string,
    fieldType: string,
    check: string | null,
    sort: string | null,
    comments: string | null
};

type ExcelSheet = {
    sheetName: string,
    sheetData: ExcelField[]
};

type ExcelTableType = {
    id: string,
    header: string,
    tableData: ExcelSheet[]
};

const defaultExcelTable: ExcelSheet[] = [
    {sheetName: "Sheet 1", sheetData: [
        {fieldName: "Column 1", fieldType: "Text", check: null, sort: null, comments: "First Comment!"}, 
        {fieldName: "Column 2", fieldType: "Number", check: null, sort: null, comments: "Second Comment!"}]},
    {sheetName: "Sheet 2", sheetData: [
        {fieldName: "Column 1", fieldType: "Text", check: null, sort: null, comments: "Second First Comment!"},
        {fieldName: "Column 2", fieldType: "Text", check: null, sort: null, comments: "Second Second Comment!"}]}   
];

const ExcelTableNode = ({data}: {data: ExcelTableType}) => {
    const tableData = data.tableData || defaultExcelTable;
    const tableHeader = data.header || "MyTable";
    const tableID = data.id || `${data.tableData.length + 1}`;

    return (
        <div className='w-[400px] border-2 border-green-600 bg-emerald-300 rounded-xl border-rounded-xl'>
            <Handle type="target" position={Position.Top} style={{top: '-4px', width: '8px', height: '8px'}}/>
                <Table className='text-left w-full'>
                    <TableHeader>
                        <TableRow className="font-mono text-lg">
                            <TableHead></TableHead> {/* Spacer. DO NOT REMOVE */}
                            <TableHead className='text-white'>{tableHeader}</TableHead>
                            <TableHead className='align-right text-right text-white'>ID: {tableID}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='text-left w-full'>
                        {tableData.map((sheet) => (
                        <TableRow key={sheet.sheetName} className="relative w-1/2 font-mono text-lg">
                            <td>
                                <Handle type="target" position={Position.Left} id={`sheet-${sheet.sheetName}-t`} className='border-t border-b border-white' style={{position: 'absolute', left: '4px', width: '8px', height: '8px'}}/>
                            </td>
                            <TableCell className="text-left w-1/4 border-t border-b-2 border-white text-black">{sheet.sheetName}</TableCell>
                            <TableCell className="p-0">
                                <Table>
                                    <TableBody>
                                    {sheet.sheetData.map((field) => (
                                        <TableRow key={field.fieldName} className="relative w-full font-mono text-lg">
                                            <TableCell className="text-left border-b border-white text-black">{field.fieldName}</TableCell>
                                            <TableCell className="text-left border-b border-white text-black">{field.fieldType}</TableCell>
                                            <TableCell className="text-left border-b border-white text-black">
                                                <Handle type="source" position={Position.Right} id={`${sheet.sheetName}-row-${field.fieldName}-s`} className='border-b-4 border-white' style={{position: 'absolute', right: '4px', width: '8px', height: '8px'}}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            <Handle type="source" position={Position.Bottom} style={{bottom: '-4px', width: '8px', height: '8px'}}id="a" />
        </div>
    )
}

export default ExcelTableNode;