// =========================================================================
// CAREER OS - GLOBAL REACTIVE EVENT BUS
// =========================================================================

type GraphChangeListener = (event?: { type: string; payload?: any }) => void;

class CareerGraphEventBus {
  private listeners: Set<GraphChangeListener> = new Set();

  public subscribe(listener: GraphChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: { type: string; payload?: any } = { type: 'DATA_CHANGED' }): void {
    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (err) {
        console.error('Error in CareerGraphEventBus listener:', err);
      }
    });
  }
}

export const careerGraphEventBus = new CareerGraphEventBus();
