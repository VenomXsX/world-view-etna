"use client";

import { useEffect, useState } from "react";
import { fetchByCca3 } from "../../../../api/requests";
import { Country } from "@/utils/types";
import BackButton from "@/components/BackButton";
import { fetchNeighboringCountries } from "../../../../api/requests";
import { NameField } from "@/utils/types";
import BasicCountryInfo from "@/components/BasicCountryInfo";
import CountryDetails from "@/components/CountryDetails";
import CulturalData from "@/components/CulturalData";
import EcoDemoData from "@/components/EcoDemoData";
import GeoData from "@/components/GeoData";

export default function DetailsCountry({
  params,
}: {
  params: { code: string };
}) {
  const [country, setCountry] = useState<Country | null>(null);
  const [neighborCountries, setNeighborCountries] = useState<NameField[]>([]);
  const [currencyKeys, setCurrencyKeys] = useState<string[]>([]);
  const [giniKeys, setGiniKeys] = useState<string[]>([]);
  const [demonymKeys, setDemonymKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nativeLanguages, setNativeLanguages] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [populationCount, setPopulationCount] = useState<number>(0);
  const [giniCount, setGiniCount] = useState<number>(0);
  const [maxGini, setMaxGini] = useState<number>(0);
  const codeParams = params.code?.toUpperCase();

  useEffect(() => {
    if (codeParams) {
      fetchByCca3(codeParams).then((data: Country[]) => {
        if (data) {
          setCountry(data[0]);
          setLoading(false);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (country) {
      setNativeLanguages(
        country.name.nativeName ? Object.keys(country.name.nativeName) : []
      );
      setLanguages(country.languages ? Object.keys(country.languages) : []);
      setCurrencyKeys(
        country.currencies ? Object.keys(country.currencies) : []
      );
      setGiniKeys(country.gini ? Object.keys(country.gini) : []);
      setMaxGini(country.gini ? country.gini[Number(giniKeys[0])] : 0);
      setDemonymKeys(country.demonyms ? Object.keys(country.demonyms) : []);
      fetchNeighboringCountries(
        country.borders ? Object.values(country.borders) : []
      ).then((data: NameField[]) => {
        if (data) {
          setNeighborCountries(data.flat());
        }
      });
    }
  }, [country,]);

  useEffect(() => {
    if (country) {
      const populationIncrement = Math.ceil(country.population / 100);
      const interval = setInterval(() => {
        if (populationCount < country.population) {
          setPopulationCount(populationCount + populationIncrement);
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [populationCount, country?.population]);

  useEffect(() => {
    if (country) {
      const giniIncrement = Math.ceil(country.gini[Number(giniKeys[0])] / 100);
      const interval = setInterval(() => {
        if (giniCount < country.gini[Number(giniKeys[0])]) {
          setGiniCount(giniCount + giniIncrement);
        }
      }, 1);

      return () => clearInterval(interval);
    }
  }, [giniCount, maxGini]);

  return (
    <div className="pt-36 sm:pt-20">
      {!loading ? (
        country ? (
          <>
            <div className="w-full">
              <BackButton />
            </div>
            <main className="w-full h-fit min-h-screen">
              <div className="w-full h-fit min-h-screen flex flex-col justify-start items-start p-4 bg-transparent">
                {/* BASIC COUNTRY INFO (name, flag) */}
                <BasicCountryInfo
                  country={country}
                  languages={nativeLanguages}
                />

                <div className="w-full flex flex-col sm:flex-row gap-12 justify-center items-center p-12 bg-white/10 backdrop-blur-md text-secondary">
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-secondary/30">Continent</span>
                    <span className="text-4xl font-bold">{country.region}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-secondary/30">
                      Population
                    </span>
                    <span className="text-4xl font-bold">
                      {populationCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-secondary/30">
                      GINI Index {maxGini !== 0 ? Number(giniKeys[0]) : "N/A"}
                    </span>
                    <span className="text-4xl font-bold">
                      {giniCount / 100}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row gap-x-48 gap-y-12 flex-wrap p-12 justify-center">
                  <CountryDetails country={country} />

                  {/* CULTURAL DATA */}
                  <CulturalData
                    country={country}
                    languages={languages}
                    demonymKeys={demonymKeys}
                  />

                  {/* ECONOMIC AND DEMOGRAPHIC DATA */}
                  <EcoDemoData
                    country={country}
                    currencyKeys={currencyKeys}
                    giniKeys={giniKeys}
                  />

                  {/* GEOGRAPHICAL DATA */}
                  <GeoData
                    country={country}
                    neighborCountries={neighborCountries}
                  />
                </div>
              </div>
            </main>
          </>
        ) : (
          <div className="w-full h-screen flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-secondary">
              Country code not found!
            </span>
            <BackButton />
          </div>
        )
      ) : (
        <div className="w-full h-screen flex flex-row justify-center items-center">
          <span className="text-3xl font-bold text-secondary">Loading...</span>
        </div>
      )}
    </div>
  );
}
