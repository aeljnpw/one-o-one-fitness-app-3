import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Exercise, Equipment } from '../types/supabase';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('exercises')
        .select('*')
        .limit(10);

      if (err) {
        throw err;
      }

      setExercises(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exercises');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  return { exercises, loading, error, refetch: fetchExercises };
};

export const useEquipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('equipment')
        .select('*')
        .order('name');

      if (err) {
        throw err;
      }

      setEquipments(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  };

  return { equipments, loading, error, refetch: fetchEquipments };
}; 