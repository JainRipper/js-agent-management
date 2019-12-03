$(document).ready(function () {
  // Datatable columns
  let columns = [{
    title: "Agent ID",
    data: "id",
    width: '10%'
  }, {
    title: "Email",
    data: "email",
    searchable: false
  }, {
    title: "First Name",
    data: "firstName",
    searchable: false
  }, {
    title: "Last Name",
    data: "lastName",
    searchable: false
  }, {
    title: "Status",
    data: "status",
    width: '17%',
    searchable: false,
    render: function (data, type, full) {
      return `<span>${full.status}</span>`;
    },
  }, {
    title: "Actions",
    render: function (data, type, full) {
      return `
      <a href="02_NewAgent.html?id=${full.id}" class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
      <a href="#" class="delete" onclick="onbtnDeleteClick(this)" title="Delete" data-id="${full.id}"><i class="material-icons">&#xE872;</i></a>`;
    },
    className: 'all',
    orderable: false,
    width: '10%',
    searchable: false
  }];

  $('#myAgents').DataTable({
    "sPaginationType": "simple_numbers",
    data: getStorageItem('agents'),       // where is 'agents' ?
    columns: columns,
    pageLength: 5,
    responsive: true,
    lengthChange: false,
    dom: 'Bfratip',       // Bfratip ?
    buttons: [
      {
        text: 'Register Agent',
        action: function (e, dt, node, config) {
          window.location.href = "02_NewAgent.html";
        }
      }
    ],
    "columnDefs": [ {
      "targets": 4,
      "createdCell": function (td, cellData, rowData, row, col) {
        switch(cellData) {
          case "locked":
            $(td).addClass('label_locked');
            break;
          case "Active":
            $(td).addClass('label_active');
            break;
          case "active":
            $(td).addClass('label_active');
            break;
        }
      }
    } ]
  }).on( 'responsive-display', function ( e, datatable, row, showHide, update ) {
    if(typeof row.selector.rows[0] !== 'undefined'){
      let hiddenStatus = $('.dtr-data span').html();
      if (hiddenStatus == 'active') {
        $(row.selector.rows[0].nextSibling).find('li[data-dt-column="4"] .dtr-data').addClass('label_active');
      } else if (hiddenStatus == 'locked') {
        $(row.selector.rows[0].nextSibling).find('li[data-dt-column="4"] .dtr-data').addClass('label_locked');
      }      
    }
  });

  // Delete row
  $('#btnConfirmDelete').click(function () {
    let id = $(this).data('id');    // .data ?
    let agents = getStorageItem('agents');
    let agentIndex = agents.findIndex(agent => agent.id === id);
    if (agentIndex >= 0) {
      agents.splice(agentIndex, 1);
      setStorageItem('agents', agents);     // Update agents
      location.reload();
    }
    $('#deleteModal').modal('hide');
  });
});

function onbtnDeleteClick(object) {
  let id = $(object).data('id');
  let agents = getStorageItem('agents');
  let agent = agents.find(agent => agent.id === id);
  if (!agent) {
    return;
  }
  $('#deleteModalBodyText').text(`Are you sure you want to delete ${agent.firstName} ${agent.lastName}?`);
  $('#deleteModal').modal('show');
  $('#btnConfirmDelete').data('id', id)
}