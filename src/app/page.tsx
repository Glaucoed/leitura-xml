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

export default function Home() {
  const [xmlDataCompra, setXmlDataCompra] = useState<ICMSTot | null>(null);
  const [xmlDataVenda, setXmlDataVenda] = useState<ICMSTot | null>(null);

  useEffect(() => {
    const fetchAndParseXML = async (file: string, setDataFunction: React.Dispatch<React.SetStateAction<ICMSTot | null>>) => {
      try {
        const response = await fetch(file);
        const xmlData = await response.text();
        const parsedData = xmljs.xml2js(xmlData, { compact: true }) as ElementCompact;
        const ICMS: ICMSTot  = parsedData.nfeProc.NFe.infNFe.total.ICMSTot;
        setDataFunction(ICMS);

      } catch (error) {
        console.error('Ocorreu um erro ao carregar o arquivo XML:', error);
      }
    };

    fetchAndParseXML('/berg.xml', setXmlDataCompra);
    fetchAndParseXML('/centralmro.xml', setXmlDataVenda);
  }, []);

  console.log(xmlDataVenda, 'venda');
  console.log(xmlDataCompra, 'compra');

  return (
    <div>
      <p>Verifique o console para ver o resultado da conversão.</p>
    </div>
  );
}
