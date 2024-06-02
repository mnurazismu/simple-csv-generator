import { Button, Card, Label, TextInput } from "flowbite-react";
import axios from "axios";
import { useState } from "react";

interface Header {
  name: string;
  type: "string" | "number" | "date";
}

const CSVGenerator: React.FC = () => {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [headerName, setHeaderName] = useState<string>("");
  const [headerType, setHeaderType] = useState<Header["type"]>("string");
  const [totalRows, setTotalRows] = useState<number>(0);

  const addHeader = () => {
    if (!headerName) return;
    setHeaders([...headers, { name: headerName, type: headerType }]);
    setHeaderName("");
    setHeaderType("string");
  };

  const updateHeader = (index: number, updatedHeader: Header) => {
    const newHeaders = [...headers];
    newHeaders[index] = updatedHeader;
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
      const newHeaders = headers.filter((_, i) => i !== index);
      setHeaders(newHeaders);
  };

  const handleGenerateCSV = async () => {
    if (!headers.length || !totalRows) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/generate-csv",
        {
          headers,
          totalRows,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("There was an error generating the CSV file", error);
    }
  };

  return (
    <Card className="max-w-sm min-w-96 shadow-lg">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-center">Simple CSV Generator</h1>
        <div className="flex">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="header" value="Header" />
            </div>
            <TextInput
              id="header"
              type="text"
              placeholder="Insert Header"
              required
              value={headerName}
              onChange={(e) => setHeaderName(e.target.value)}
            />
          </div>
          <div className="max-w-sm m-auto">
            <Label htmlFor="type" value="Type" />
            <select
              id="type"
              className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
              value={headerType}
              onChange={(e) => setHeaderType(e.target.value as Header["type"])}
            >
              <option selected>Choose a type</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
        <Button onClick={addHeader} className="bg-cyan-500">Add Header</Button>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="totalRows" value="Total Rows Generated" />
          </div>
          <TextInput id="totalRows" type="number" placeholder="Insert Total Rows Generated" required value={totalRows === 0 ? '' : totalRows} onChange={(e) => setTotalRows(parseInt(e.target.value, 10))} />
        </div>
        <Button onClick={handleGenerateCSV} className="bg-emerald-500">Generate CSV</Button>
        <hr />
        <h2 className="font-semibold">Headers</h2>
        <ul>
          {/* ubah menjadi apabila tidak ada headernya maka tampilkan teks header belum ditambah, jika ada baru tampilkan header */}
          {headers.length === 0 && <li className="text-sm text-red-300">No headers have been added yet.</li>}
          {headers.map((header, index) => (
            <li key={index}>
              <div className="flex gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="header" value="Header" />
                  </div>
                  <TextInput
                    id="header"
                    type="text"
                    value={header.name}
                    onChange={(e) => updateHeader(index, { ...header, name: e.target.value })}
                  />
                </div>
                <div className="max-w-sm m-auto">
                  <Label htmlFor="type" value="Type" />
                  <select
                    id="type"
                    className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={header.type}
                    onChange={(e) => updateHeader(index, { ...header, type: e.target.value as 'string' | 'number' | 'date' })}
                  >
                    <option selected>Choose a type</option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => removeHeader(index)} className="bg-red-500">Remove</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CSVGenerator;
