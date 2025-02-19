
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
        <div style={{width: 450}}>
            <Handle type="target" position={Position.Top} style={{top: '-4px'}}/>
                <Table className='bg-green-100 rounded-xl border-rounded-xl text-left'>
                    <TableHeader className="w-[300px]">
                        <TableRow className="w-full">
                            <TableHead>{tableHeader}</TableHead>
                            <TableHead className='align-right text-right'>({tableID})</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='text-left'>
                        {tableData.map((sheet) => (
                        <TableRow key={sheet.sheetName} className="relative w-1/2">
                            <td>
                                <Handle type="target" position={Position.Left} id={`row-${sheet.sheetName}-t`} style={{position: 'absolute', left: '4px'}}/>
                            </td>
                            <TableCell className="text-left w-1/2">{sheet.sheetName}</TableCell>
                            <TableCell className="w-1/2 p-0">
                                <Table>
                                    <TableBody>
                                    {sheet.sheetData.map((field) => (
                                        <TableRow key={field.fieldName} className="relative w-full">
                                            <TableCell className="text-left">{field.fieldName}</TableCell>
                                            <TableCell className="text-left">{field.fieldType}</TableCell>
                                            <td>
                                                <Handle type="source" position={Position.Right} id={`row-${field.fieldName}-s`} style={{position: 'absolute', right: '4px'}}/>
                                            </td>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableCell>
                        </TableRow>
                        ))}
                </TableBody>
                </Table>
            <Handle type="source" position={Position.Bottom} style={{bottom: '-4px'}}id="a" />
        </div>
    )
}

export default ExcelTableNode;