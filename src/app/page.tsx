"use client";

import { useEffect, useState } from "react";
import { fetchAll } from "../../api/requests";
import { Country } from "@/utils/types";
import Card from "@/components/Card";
import { sortCountries } from "@/utils/helper";
import RandomCountryButton from "@/components/RandomCountryButton";
import ReverseButton from "@/components/ReverseButton";
import Icon from "@/components/Icon";

export default function Home() {
  const [all, setAll] = useState<Country[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reversed, setReversed] = useState<boolean>(false);

  useEffect(() => {
    fetchAll().then((data: Country[]) => {
      const sorted = sortCountries({
        countries: data,
        order: "alphaName",
      });
      setLoading(false);
      return setAll(sorted);
    });
  }, []);

  useEffect(() => {
    if (all) {
      const updated = sortCountries({
        countries: all,
        order: "alphaName",
        reversed: reversed,
      });
      setAll(updated);
    }
  }, [reversed]);

  const handleReverse = () => setReversed(!reversed);

  return (
    <>
      <main className="w-full sm:min-h-screen sm:h-fit backdrop-blur-md pt-36 sm:pt-24">
        {!loading ? (
          !all ? (
            <span className="text-3xl font-bold text-secondary">
              Rien trouvé
            </span>
          ) : (
            <>
              <div className="w-full my-4 flex flex-col gap-4 sm:flex-row justify-start sm:justify-center items-center">
                <RandomCountryButton all={all} />
                <ReverseButton handler={handleReverse} reversed={reversed} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-8 place-items-center">
                {all.map((e: Country, i) => (
                  <Card key={i} country={e} />
                ))}
              </div>
            </>
          )
        ) : (
          <div className="w-full h-screen flex flex-col justify-center items-center">
            <Icon className="h-32 w-32" type="Loading" />
          </div>
        )}
      </main>
    </>
  );
}
