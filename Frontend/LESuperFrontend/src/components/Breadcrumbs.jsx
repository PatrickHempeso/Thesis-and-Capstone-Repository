import React from 'react';

function Breadcrumbs({ items, onNavigate }) {
  return (
    <div className="breadcrumbs" id="breadcrumbs">
      {items.map((item, index) => (
        <div key={index} className="breadcrumb">
          {index === items.length - 1 ? (
            <span>{item.name}</span>
          ) : (
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                onNavigate(); 
              }}
            >
              {item.name}
            </a>
          )}
          {index < items.length - 1 && <div className="breadcrumb-separator">/</div>}
        </div>
      ))}
    </div>
  );
}

export default Breadcrumbs;