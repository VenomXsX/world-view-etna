"use client";

import { useEffect, useState } from "react";
import { Country } from "@/utils/types";
import { fetchAll, fetchSubregions } from "../../../api/requests";
import Card from "@/components/Card";
import BackButton from "@/components/BackButton";
import ReverseButton from "@/components/ReverseButton";
import { filterTheCountries, sortCountries } from "@/utils/helper";

export default function AdvancedSearch() {
  const [all, setAll] = useState<Country[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [continentVal, setContinentVal] = useState("all");
  const [subcontinents, setSubcontinents] = useState<string[]>([]);
  const [subcontinentText, setSubcontinentText] =
    useState<string>("subcontinents");
  // this is for the user chosen subcontinent
  const [subcontinent, setSubcontinent] = useState<string>("all-continents");
  const [reversed, setReversed] = useState<boolean>(false);
  const [subs, setSubs] = useState<string[]>([]);

  useEffect(() => {
    fetchAll().then((data) => {
      setAll(data);
    });
    fetchSubregions().then((data) => {
      setSubs(data);
      setSubcontinents(data.toSorted());
    });
  }, []);

  // useEffect(() => {
  //   console.log(subs);
  // }, [subs]);

  useEffect(() => {
    if (all) {
      const updated = sortCountries({
        countries: all,
        order: "alphaName",
        reversed: reversed,
      });
      setAll(updated);
    }
  }, [reversed, continentVal, subcontinent, all]);

  const handleInputChange = (input: string) => {
    setInputVal(input);
  };

  const handleContinentChange = (continent: string) => {
    setContinentVal(continent);
    setSubcontinentText(continent);
    setSubcontinent("all-continents");
    switch (continent) {
      case "all":
        setSubcontinents(subs);
        break;
      case "americas":
        setSubcontinents(subs.filter((item) => item.includes("America")));
        break;
      default:
        setSubcontinents(
          subs.filter((item) => item.toLowerCase().includes(continent))
        );
    }
  };

  const handleSubcontinentChange = (subcontinent: string) => {
    setSubcontinent(subcontinent);
  };

  const handleReverse = () => setReversed(!reversed);

  const filtered = sortCountries({
    countries: filterTheCountries({
      all,
      continentVal,
      inputVal,
      subcontinent: subcontinent ?? "",
    }),
    order: "alphaName",
    reversed: reversed,
  });

  return (
    <div className="pt-40 sm:pt-20 w-full flex flex-col justify-start items-center h-fit min-h-screen">
      <div className="w-full">
        <BackButton />
      </div>
      <form className="w-full mb-4 flex flex-col gap-2 p-4 pt-0 justify-start items-center">
        <span className="text-secondary font-serif text-3xl">
          Avanced search
        </span>
        <div className="w-full flex flex-row justify-center items-center gap-4">
          <input
            type="text"
            className="h-12 bg-white/10 outline-none text-secondarys/70 p-4 rounded-md text-secondary placeholder:italic placeholder:text-secondary/70"
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Country name"
            value={inputVal}
          />
          <select
            name="continent"
            className="h-12 p-4 bg-white/10 outline-none focus:bg-white/20 rounded-md text-secondary/70 [&>option]:text-black [&>option]:font-sans"
            onChange={(e) => handleContinentChange(e.target.value)}
          >
            <option value="all">All continent</option>
            <option value="africa">Africa</option>
            <option value="americas">America</option>
            <option value="asia">Asia</option>
            <option value="antarctic">Antarctic</option>
            <option value="europe">Europe</option>
            <option value="oceania">Oceania</option>
          </select>
          <select
            name="subcontinent"
            className="h-12 p-4 bg-white/10 outline-none focus:bg-white/20 rounded-md text-secondary/70 [&>option]:text-black [&>option]:font-sans"
            onChange={(e) => handleSubcontinentChange(e.target.value)}
            defaultValue="all-continents"
          >
            <option value="all-continents">
              {subcontinentText !== "subcontinents"
                ? `All ${subcontinentText} subcontinents`
                : "Subcontinents"}
            </option>
            {subcontinents.map((subregion, i) => (
              <option key={i} value={subregion}>
                {subregion}
              </option>
            ))}
          </select>
          <ReverseButton handler={handleReverse} reversed={reversed} />
        </div>
      </form>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {filtered.map((item, i) => (
          <Card key={i} country={item} />
        ))}
      </div>
    </div>
  );
}
