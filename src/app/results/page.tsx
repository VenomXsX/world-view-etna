"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import { searchCountriesByName } from "../../../api/requests";
import { useEffect, useState } from "react";
import { Country } from "@/utils/types";
import HomeButton from "@/components/HomeButton";
import BackButton from "@/components/BackButton";
import { sortCountries } from "@/utils/helper";
import ReverseButton from "@/components/ReverseButton";
import Icon from "@/components/Icon";

export default function Results() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [results, setResults] = useState<Country[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reversed, setReversed] = useState<boolean>(false);

  useEffect(() => {
    if (q) {
      searchCountriesByName(q).then((data: Country[]) => {
        setResults(sortCountries({ countries: data, order: "alphaName" }));
        setLoading(false);
      });
    }
  }, [q]);

  useEffect(() => {
    if (results) {
      const updated = sortCountries({
        countries: results,
        order: "alphaName",
        reversed: reversed,
      });
      setResults(updated);
    }
  }, [reversed]);

  const handleReverse = () => setReversed(!reversed);

  return (
    <main className="w-full sm:min-h-screen sm:h-fit backdrop-blur-md pt-44 sm:pt-20">
      <div className="w-full">
        <BackButton />
      </div>
      <div className="flex flex-row justify-center">
        {!loading ? (
          results ? (
            <div className="w-full">
              <div className="w-full flex flex-row justify-center items-center">
                <span className="m-8 mr-2 text-3xl font-bold text-secondary">
                  Results for {'"'}
                  {q}
                  {'"'} ({results ? results.length : 0} match
                  {results.length === 1 ? "" : "es"})
                </span>
                <ReverseButton handler={handleReverse} reversed={reversed} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-8 place-items-center">
                {results.map((country, i) => (
                  <Card key={i} country={country} />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <span className="text-3xl font-bold text-secondary">
                No results...
              </span>
              <HomeButton />
            </div>
          )
        ) : (
          <Icon className="h-32 w-32" type="Loading" />
        )}
      </div>
    </main>
  );
}
