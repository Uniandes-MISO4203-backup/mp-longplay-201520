package co.edu.uniandes.csw.musicstore.api;

import co.edu.uniandes.csw.musicstore.dtos.ClientDTO;
import java.util.List;

public interface IClientLogic {
    public int countClients();
    public List<ClientDTO> getClients(Integer page, Integer maxRecords);
    public List<ClientDTO> getAllClients();
    public ClientDTO getClient(Long id);
    public ClientDTO createClient(ClientDTO dto);
    public ClientDTO updateClient(ClientDTO dto);
    public void deleteClient(Long id);
    public List<ClientDTO> findByName(String name);
    public ClientDTO getClientByUserId(String userId);
}
