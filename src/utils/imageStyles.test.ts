import { describe, expect, it } from 'vitest';

import { getImageStyles } from './imageStyles';

describe('imageStyles', () => {
  describe('getImageStyles', () => {
    it('should return empty object when no image provided', () => {
      const styles = getImageStyles();
      expect(styles).toEqual({});
    });

    it('should return empty object when image is undefined', () => {
      const styles = getImageStyles(undefined);
      expect(styles).toEqual({});
    });

    it('should return empty object for image with no transformations', () => {
      const styles = getImageStyles({});
      expect(styles).toEqual({});
    });

    it('should set objectPosition when position is provided', () => {
      const styles = getImageStyles({ position: 'center top' });
      expect(styles).toEqual({
        objectPosition: 'center top',
      });
    });

    it('should handle percentage position values', () => {
      const styles = getImageStyles({ position: '50% 25%' });
      expect(styles).toEqual({
        objectPosition: '50% 25%',
      });
    });

    it('should generate scale transform', () => {
      const styles = getImageStyles({ scale: 1.2 });
      expect(styles).toEqual({
        transform: 'scale(1.2)',
      });
    });

    it('should generate rotate transform', () => {
      const styles = getImageStyles({ rotate: 45 });
      expect(styles).toEqual({
        transform: 'rotate(45deg)',
      });
    });

    it('should generate negative rotate transform', () => {
      const styles = getImageStyles({ rotate: -10 });
      expect(styles).toEqual({
        transform: 'rotate(-10deg)',
      });
    });

    it('should combine scale and rotate transforms', () => {
      const styles = getImageStyles({ scale: 1.5, rotate: 30 });
      expect(styles).toEqual({
        transform: 'scale(1.5) rotate(30deg)',
      });
    });

    it('should combine position and scale', () => {
      const styles = getImageStyles({ position: 'center bottom', scale: 1.1 });
      expect(styles).toEqual({
        objectPosition: 'center bottom',
        transform: 'scale(1.1)',
      });
    });

    it('should combine position and rotate', () => {
      const styles = getImageStyles({ position: '75% 50%', rotate: -5 });
      expect(styles).toEqual({
        objectPosition: '75% 50%',
        transform: 'rotate(-5deg)',
      });
    });

    it('should combine all three transformations', () => {
      const styles = getImageStyles({
        position: 'center center',
        scale: 1.3,
        rotate: 15,
      });
      expect(styles).toEqual({
        objectPosition: 'center center',
        transform: 'scale(1.3) rotate(15deg)',
      });
    });

    it('should handle scale value of 1', () => {
      const styles = getImageStyles({ scale: 1 });
      expect(styles).toEqual({
        transform: 'scale(1)',
      });
    });

    it('should handle rotate value of 0 (falsy, returns empty)', () => {
      const styles = getImageStyles({ rotate: 0 });
      // 0 is falsy, so no transform is applied
      expect(styles).toEqual({});
    });

    it('should handle decimal scale values', () => {
      const styles = getImageStyles({ scale: 0.8 });
      expect(styles).toEqual({
        transform: 'scale(0.8)',
      });
    });

    it('should handle large rotate values', () => {
      const styles = getImageStyles({ rotate: 360 });
      expect(styles).toEqual({
        transform: 'rotate(360deg)',
      });
    });
  });
});
