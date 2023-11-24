'use client'
import React, { useState, useEffect } from 'react';
import xmljs, { ElementCompact } from 'xml-js';

interface ICMSTot {
  vBC: { _text: string };
  vBCST: { _text: string };
  vCOFINS: { _text: string };
  vDesc: { _text: string };
  vFCP: { _text: string };
  vFCPST: { _text: string };
  vFCPSTRet: { _text: string };
  vFrete: { _text: string };
  vICMS: { _text: string };
  vICMSDeson: { _text: string };
  vII: { _text: string };
  vIPI: { _text: string };
  vIPIDevol: { _text: string };
  vNF: { _text: string };
  vOutro: { _text: string };
  vPIS: { _text: string };
  vProd: { _text: string };
  vST: { _text: string };
  vSeg: { _text: string };
  vTotTrib: { _text: string };
}

interface IDto {
  frete: number;
  icms: number;
  custo: number;
  icmsst: number;
  estado: string;
}
interface IDtoRemoved {
  frete: number;
  icms: number;
  icmsst: number;
  custo: number;
}

export default function Home() {
  const [xmlDataCompra, setXmlDataCompra] = useState<IDto | IDtoRemoved | null>(null);
  const [xmlDataVenda, setXmlDataVenda] = useState<IDto | IDtoRemoved | null>(null);

  useEffect(() => {
    const fetchAndParseXML = async (file: string, setDataFunction: React.Dispatch<React.SetStateAction<IDto | IDtoRemoved | null>>, type: string) => {
      try {
        const response = await fetch(file);
        const xmlData = await response.text();
        const parsedData = xmljs.xml2js(xmlData, { compact: true }) as ElementCompact;
        const ICMS: ICMSTot  = parsedData.nfeProc.NFe.infNFe.total.ICMSTot;
        const estado = parsedData.nfeProc.NFe.infNFe.dest.enderDest.UF._text
        let dto: IDto | IDtoRemoved;

        if (type === 'venda') {
          dto = {
            frete: Number(ICMS?.vFrete._text),
            icms: Number(ICMS?.vICMS._text),
            icmsst: Number(ICMS?.vBCST._text),
            custo: Number(ICMS?.vNF._text),
            estado,
          };
        } else {
          dto = {
            frete: Number(ICMS?.vFrete._text),
            icms: Number(ICMS?.vICMS._text),
            icmsst: Number(ICMS?.vBCST._text),
            custo: Number(ICMS?.vNF._text),
            estado,
          };
        }

        setDataFunction(dto);

        

      } catch (error) {
        console.error('Ocorreu um erro ao carregar o arquivo XML:', error);
      }
    };

    fetchAndParseXML('/berg.xml', setXmlDataCompra, 'compra');
    fetchAndParseXML('/central.xml', setXmlDataVenda, 'venda');
  }, []);

  console.log(xmlDataVenda, 'venda');

  console.log(xmlDataCompra, 'compra');

  return (
    <div>
      <p>Verifique o console para ver o resultado da conversão.</p>
    </div>
  );
}
