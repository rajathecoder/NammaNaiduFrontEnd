import { useEffect, useMemo, useState } from 'react';
import {
  getMastersByType,
  type MasterItem,
  type MasterType,
} from '../services/api/master.api';

type MasterMap = Partial<Record<MasterType, MasterItem[]>>;

interface UseMasterDataResult {
  masters: MasterMap;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMasterData = (types: MasterType[]): UseMasterDataResult => {
  const [masters, setMasters] = useState<MasterMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const typesKey = useMemo(() => {
    const sanitized = (types ?? []).filter(Boolean) as MasterType[];
    if (!sanitized.length) return '';
    const unique = Array.from(new Set(sanitized));
    unique.sort();
    return unique.join('|');
  }, [types]);

  const normalizedTypes = useMemo<MasterType[]>(() => {
    if (!typesKey) {
      return [];
    }
    return typesKey.split('|') as MasterType[];
  }, [typesKey]);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      if (!normalizedTypes.length) {
        if (isActive) {
          setMasters({});
          setLoading(false);
        }
        return;
      }

      if (isActive) {
        setLoading(true);
        setError(null);
      }

      try {
        const responses = await Promise.all(
          normalizedTypes.map(async (type) => {
            const response = await getMastersByType(type);

            if (!response.success) {
              throw new Error(response.message || `Failed to load ${type} masters`);
            }

            return [type, response.data] as const;
          })
        );

        if (isActive) {
          const mapped = responses.reduce((acc, [type, data]) => {
            acc[type] = data;
            return acc;
          }, {} as MasterMap);
          setMasters(mapped);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Failed to load master data');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [normalizedTypes, refreshKey]);

  const refetch = () => setRefreshKey((prev) => prev + 1);

  return {
    masters,
    loading,
    error,
    refetch,
  };
};

export default useMasterData;

