
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
    fieldFormat: string,
    fieldDataType: string,
    fieldDataValidation: string | null,
    fieldSort: string | null,
    fieldComments: string | null
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
        {fieldName: "Column 1", fieldFormat: "Text", fieldDataType: "Text", fieldDataValidation: null, fieldSort: null, fieldComments: "First Comment!"}, 
        {fieldName: "Column 2", fieldFormat: "Number", fieldDataType: "Number", fieldDataValidation: null, fieldSort: null, fieldComments: "Second Comment!"}]},
    {sheetName: "Sheet 2", sheetData: [
        {fieldName: "Column 1", fieldFormat: "Text", fieldDataType: "Text", fieldDataValidation: null, fieldSort: null, fieldComments: "Second First Comment!"},
        {fieldName: "Column 2", fieldFormat: "Text", fieldDataType: "Text", fieldDataValidation: null, fieldSort: null, fieldComments: "Second Second Comment!"}]}   
];

const ExcelTableNode = ({data}: {data: ExcelTableType}) => {
    const tableData = data.tableData || defaultExcelTable;
    const tableHeader = data.header || "MyTable";
    const tableID = data.id || `${data.tableData.length + 1}`;

    return (
        <div style={{width: 400}}>
            <Handle type="target" position={Position.Top} style={{top: '-4px'}}/>
            <div>
                <Table className='bg-green-100 rounded-xl border-rounded-xl text-left'>
                    <TableHeader className="w-[300px]">
                        {<TableRow>
                            <TableHead>{tableHeader}</TableHead>
                            <TableHead className='align-right text-right'>({tableID})</TableHead>
                        </TableRow>}
                    </TableHeader>
                    <TableBody className='text-left'>
                    {tableData.map((sheet) => (
                    <TableRow key={sheet.sheetName} className="relative">
                        <Handle type="target" position={Position.Left} id={`row-${sheet.sheetName}-t`} style={{position: 'absolute', left: '2px'}}/>
                        <TableCell className="text-left">{sheet.sheetName}</TableCell>
                        <TableBody>
                            {sheet.sheetData.map((field) => (
                                <TableRow key={field.fieldName} className="relative">
                                    <TableCell className="text-left">{field.fieldName}</TableCell>
                                    <TableCell className="text-left">{field.fieldFormat}</TableCell>
                                    <Handle type="source" position={Position.Right} id={`row-${field.fieldName}-s`} style={{position: 'absolute', right: '2px'}}/>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <Handle type="source" position={Position.Bottom} style={{bottom: '-4px'}}id="a" />
        </div>
    )
}

export default ExcelTableNode;