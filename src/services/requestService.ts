export interface ServiceRequest {
  id: string;
  customerName: string;
  status: string;
  createdAt: string;
}

export async function listRequests(): Promise<ServiceRequest[]> {
  // TODO: Connect to the EIE customer API request endpoint.
  return [];
}

export async function createRequest(_request: Partial<ServiceRequest>) {
  // TODO: Connect to the EIE customer API request creation endpoint.
  return { id: '' };
}
