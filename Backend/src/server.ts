import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Parser } from 'json2csv';

const app = express();
app.use(cors({
    origin: ['http://localhost:5173']
}));
app.use(bodyParser.json());

interface Header {
    name: string;
    type: 'string' | 'number' | 'date';
}

interface CsvRequest {
    headers: Header[];
    totalRows: number;
}

app.post('/generate-csv', (req: Request<{}, {}, CsvRequest>, res: Response) => {
    const { headers, totalRows } = req.body;

    // Generate the CSV data
    const rows = Array.from({ length: totalRows }, (_, index) => {
        const row: { [key: string]: string | number | Date } = {};
        headers.forEach(header => {
            switch (header.type) {
                case 'string':
                    row[header.name] = `${header.name} ${index + 1}`;
                    break;
                case 'number':
                    row[header.name] = index + 1;
                    break;
                case 'date':
                    row[header.name] = new Date().toISOString();
                    break;
                default:
                    row[header.name] = '';
            }
        });
        return row;
    });

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields: headers.map(header => header.name) });
    const csv = json2csvParser.parse(rows);

    // Send the CSV data
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.send(csv);
    console.log('CSV generated');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});