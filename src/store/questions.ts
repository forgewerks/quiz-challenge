import { atom } from 'nanostores';
import { type Questions } from '../types/api';
export const questions = atom<Questions>([]);